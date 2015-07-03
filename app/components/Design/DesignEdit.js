import React from 'react'
import reactor from '../../state/reactor'
import Router from 'react-router'
import Store from '../../state/main'
import SVGInlineLayer  from '../SVGInlineLayer'
import Start from './EditSteps/Start'
import RenderLayers from './RenderLayers'
import Container from './EditSteps/Container'
import EditFooter from './EditFooter'
import {isInvalidEditStep} from '../../utils'

export default React.createClass({
  mixins: [reactor.ReactMixin, Router.State, Router.Navigation],

  getDataBindings() {
    return {design: Store.getters.currentDesign,
            validEditSteps: ['validEditSteps']}
  },

  componentWillMount() {
    if (isInvalidEditStep(this.state.validEditSteps,
        this.props.params.step, this.props.params.imagesOrColors)) {
      // setTimeout strategy from:
      // http://stackoverflow.com/questions/30620827/router-is-duplicating-when-clicking-a-link-element
      window.setTimeout(() => {
        this.transitionTo('designs')
      }.bind(this), 0)
      return
    }
    Store.actions.selectDesignId(this.props.params.designId)
    Store.actions.loadCurrentDesignEditResources()
    if (this.props.params.layerId) {
      Store.actions.selectLayerId(this.props.params.layerId)}
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.design && this.state.design) {
      var getParams = this.getParams()
      var propParams = this.props.params
      return (this.state.design         !== nextState.design  ||
              propParams.step           !== getParams.step    ||
              propParams.layerId        !== getParams.layerId ||
              propParams.imagesOrColors !== getParams.imagesOrColors)
    }
    return true;
  },

  componentWillUpdate(nextProps) {
    if (this.getParams().layerId &&
        this.props.params.layerId !== this.getParams().layerId) {
      Store.actions.selectLayerId(this.getParams().layerId)}
  },

  render() {
    if (this.state.design == null) { return null }

    var step = this.props.params.step
    return (
      <section className="main design-edit">

        <div className="canvas-flex-wrapper">
          <span>
            <RenderLayers layers={this.state.design.get('layers')}/>
          </span>
        </div>

        <div className="edit-ui">
          <div className="edit-steps">

            <Start isActive={step === 'start'}
                   isSmall={step === 'choose-layer'}/>

            <Container/>

          </div>
          <EditFooter />
        </div>
      </section>
    )
  }
})
