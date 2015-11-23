import React from 'react'
import Router from 'react-router'
import reactor from 'state/reactor'
import Store from 'state/main'
import {imageUrlForLayer} from 'state/utils'
import {iconPath} from 'utils'
var classNames = require('classnames')
var imgSize = 40

export default React.createClass({
  mixins: [Router.Navigation, Router.State],

  toggleCurrentLayer(e) {
    e.preventDefault()
    Store.actions.toggleCurrentLayer()
  },

  editLayerDetail() {
    this.transitionTo('designEditDetail', {
      designId: this.props.design.get('id'),
      layerId: this.props.currentLayer.get('id'),
      imagesOrColors: 'images'
    })
  },

  render() {
    var layer = this.props.layer
    var isSelected = this.props.currentLayer.get('id') === layer.get('id')
    var showMoreButton = (this.isActive('designEdit') && isSelected)
    var isEnabled = this.props.currentLayer.get('isEnabled')


    return (
      <div className="LayerSelector-container">
        <span className="LayerSelector-name">{this.props.layerIndexName}</span>
        <div className={classNames({selected: isSelected}, 'LayerSelector')}>
          <div className='LayerSelector-image-container'>
            <img src={imageUrlForLayer(layer)} onClick={this.props.onClick}/>
          </div>

          {isSelected ?
            <span className={isEnabled ? '' : 'disabled'} onClick={this.toggleCurrentLayer}>
              <img src={iconPath("eyeball.svg")}/></span>
          : null}

          {showMoreButton ?
            <span onClick={this.editLayerDetail}>more</span>
          : null}
        </div>
      </div>
    )
  }
})
