import React from 'react'
import Store from '../../../state/main'
import reactor from '../../../state/reactor'
import ColorPalette from '../../ColorPalette'
var classNames = require('classnames')

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { colorPalettes: Store.getters.colorPalettes,
             currentPalette: Store.getters.currentPalette }
  },

  choosePalette(colorPalette) {
    Store.actions.selectColorPalette(colorPalette)
  },

  render() {
    var palettes = this.state.colorPalettes.map(palette => {
      return (
        <ColorPalette onClick={this.choosePalette.bind(null, palette)}
                      currentPalette={this.state.currentPalette}
                      palette={palette}/>
      )
    })

    return (
      <section className={classNames('choose-palette', {visible: this.props.isActive})}>
        <div className="palettes-container">
          {palettes}
        </div>
      </section>
    )
  }
})
