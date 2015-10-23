import React from 'react'
import reactor from 'state/reactor'
import Store from 'state/main'
import { List } from 'Immutable'
import Tag from 'components/Tag/Tag'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDefaultProps() {
    return {
      selectedTags: List(),
      onRemoveTag: () => null,
      onAddTag: () => null,
      label: 'Tags'
    }
  },

  getInitialState() {
    return { selectedTag: null }
  },

  getDataBindings() {
    return { tags: Store.getters.tags,
             tagsMap: ['tags']}
  },

  componentWillMount() {
    if (this.state.tags.count() === 0) {
      Store.actions.loadAdminTags()
    } else {
      this.setState({selectedTag: this._nonSelectedTags(this.state).first()})
    }
  },

  componentWillUpdate(nextProps, nextState) {
    if (this.state.selectedTag === null &&
        nextState.tags.count() > 0) {
      this.setState({selectedTag: this._nonSelectedTags(nextState).first()})
    }
  },

  componentDidUpdate(prevProps, prevState) {
    var nonSelectedTags = this._nonSelectedTags(this.state)
    if (this._tagNotInUnselectedTags(this.state.selectedTag, nonSelectedTags) &&
        nonSelectedTags.count() > 0) {
      this.setState({selectedTag: nonSelectedTags.first()})
    }
  },

  _tagNotInUnselectedTags(tag, unSelectedTags) {
    return !this._nonSelectedTags(this.state).includes(tag)
  },

  _nonSelectedTags(state) {
    var selectedTagIds = this.props.selectedTags.map(t => t.get('id'))
    return state.tags.filter(t => !selectedTagIds.includes(t.get('id')))
  },

  handleTagChange(e) {
    var tag = this.state.tagsMap.get(e.target.value)
    this.setState({selectedTag:tag})
  },

  onAddTag() {
    this.props.onAddTag(this.state.selectedTag)
  },

  render() {
    var tagOptions = this._nonSelectedTags(this.state).map(tag => {
      return (
        <option value={tag.get('id')}>{tag.get('name')}</option>
      )
    })
    var selectedTagId = this.state.selectedTag ? this.state.selectedTag.get('id') : ''
    var tags = this.props.selectedTags.map(tag => {
      return <Tag tag={tag} onRemoveTag={this.props.onRemoveTag.bind(null, tag)}/>
    })
    return (
      <div className="Tags">
        <h2>{this.props.label}:</h2>
        <div>
          {tags}
        </div>
        { tagOptions.count() > 0 ?
          [<select value={selectedTagId} style={{width:'50%'}} onChange={this.handleTagChange}>
             {tagOptions}
           </select>,
           <div style={{padding:'10px 0'}}>
             <button onClick={this.onAddTag}>Add Tag +</button>
           </div>]
          : null }
      </div>
    )
  }
})
