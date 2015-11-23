import React from 'react'
import Router from 'react-router'
import Design from 'components/Design/Design'
import reactor from 'state/reactor'
import Store from 'state/main'
import {imagePath} from 'utils'

export default React.createClass({
  mixins: [reactor.ReactMixin, Router.Navigation],

  getDataBindings() {
    return { designs: Store.getters.adminCreatedDesigns }
  },

  componentWillMount() {
    Store.actions.loadAdminCreatedDesigns()
  },

  selectDesign(designId, e) {
    this.transitionTo('designDetail', {designId: designId})
  },

  render() {
    let designs = this.state.designs.map(d => {
      return (
        <li className="Design-li" key={d.get('id')}>
          <Design design={d} onClick={this.selectDesign.bind(null, d.get('id'))}/>
        </li>
      )
    })

    return (
      <div className="main">
        <section className="video-splash">
            <ul id="center-header">
                <li>THE ART YOU LOVE</li>
                <li>IN YOU COLOR</li>
            </ul>
            <div id="video">
                <video autoPlay muted loop>
                  <source src={imagePath("artdrop_splash.mp4")} type="video/mp4">
                    Your browser does not support the video tag.
                  </source>
                </video>
            </div>
        </section>
        <ul className="Designs">
          {designs}
        </ul>
        <Router.RouteHandler/>
      </div>
    )
  }
})
