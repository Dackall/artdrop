import React from 'react'
import {imageUrlForLayer, imageUrlForSurface} from '../../../state/utils'
import reactor from '../../../state/reactor'
import Store from '../../../state/main'
import {Navigation} from 'react-router'
var classNames = require('classnames')

export default React.createClass({
  mixins: [reactor.ReactMixin, Navigation],
  getDataBindings() {
    return {currentLayerId: ['currentLayerId']}
  },
  selectLayer(layerId) {
    Store.actions.selectLayerId(layerId)
    this.transitionTo('layerEdit', {designId: this.props.design.get('id'), layerId: layerId})
  },
  render() {
    return (
      <article className="layer-selector-wrapper small">
        <div className="container">
          {this.props.design.get('layers').map(layer => {
            return (
              <div className="layer-selector"
                   onClick={this.selectLayer.bind(null, layer.get('id'))}>
                <img src={imageUrlForLayer(layer)} width={40} height={40}
                     className={classNames({selected: this.state.currentLayerId === layer.get('id')})}/>
              </div>
            )
           })
          }
          <img src={null} width={40} height={40}/>
        </div>
      </article>
    )
  }
})
