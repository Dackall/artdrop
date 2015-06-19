var Nuclear = require('nuclear-js');
import {hydrateDesign, designPropsToIds, layerPropsToIds} from './helpers'
import {designsRef, layersRef} from './firebaseRefs'
import reactor from './reactor'
import getters from './getters'
import {newId} from './utils'

var stores = {}

stores.designsStore = new Nuclear.Store({

  getInitialState() {
    return Nuclear.toImmutable({});
  },

  initialize() {
   this.on('addDesign', function(state, design) {
     if (!state.has(design.id)) {
       return state.set(design.id, Nuclear.Immutable.fromJS(design));
     }
     return state
   });

   this.on('nextDesignColors', (state) => {
     var allPalettes = reactor.evaluate(getters.colorPalettes)
     var currentDesign = reactor.evaluate(getters.currentDesign)
     var layers = currentDesign.get('layers').map(layer => {
       var index = allPalettes.findIndex(c => c.get('id') === layer.getIn(['colorPalette', 'id']))
       var newPalette = allPalettes.get((index + 1) % allPalettes.count())
       return layer.set('colorPalette', newPalette)
     })
     var newDesign = currentDesign.set('layers', layers)
     return state.set(newDesign.get('id'), newDesign)
   })

   this.on('selectLayerImageId', (state, layerImageId) => {
     var currentDesign = reactor.evaluate(getters.currentDesign)
     var currentLayerId = reactor.evaluate(['currentLayerId'])
     var layerImages = reactor.evaluate(['layerImages'])
     var layers = currentDesign.get('layers')
     var i = layers.findIndex(l => l.get('id') === currentLayerId)
     var newLayers = layers.update(i, v => v.set('selectedLayerImage', layerImages.get(layerImageId)))
     var newDesign = currentDesign.set('layers', newLayers)
     return state.set(newDesign.get('id'), newDesign)
   })

   this.on('selectColorPaletteId', (state, colorPaletteId) => {
     var currentDesign = reactor.evaluate(getters.currentDesign)
     var currentLayerId = reactor.evaluate(['currentLayerId'])
     var colorPalettes = reactor.evaluate(['colorPalettes'])
     var colorPalette = colorPalettes.get(colorPaletteId)
     var layers = currentDesign.get('layers')
     var i = layers.findIndex(l => l.get('id') === currentLayerId)
     var newLayers = layers.update(i, v => v.set('colorPalette', colorPalette))
     var newDesign = currentDesign.set('layers', newLayers)
     return state.set(newDesign.get('id'), newDesign)
   })

   this.on('makeDesignCopy', (state, newDesignId) => {
     var currentDesign = reactor.evaluate(getters.currentDesign)
     var newDesign = currentDesign.update(d => {
       var newLayers = d.get('layers').map(l => l.set('id', newId()))
       newLayers.forEach(layer => {
         var l = layer.toJS()
         l.colorPalette = l.colorPalette.id
         l.selectedLayerImage = l.selectedLayerImage.id
         layersRef.child(l.id).set(l)
       })
       var now = new Date().getTime()
       return d.withMutations(d2 => {
         d2.set('id', newDesignId)
           .set('adminCreated', false)
           .set('layers', newLayers)
           .set('createdAt', now)
           .set('updatedAt', now)
       })
     })
     var firebaseDesign = designPropsToIds(newDesign)
     designsRef.child(firebaseDesign.get('id')).set(firebaseDesign.toJS())
     return state.set(newDesignId, newDesign)
   })

   this.on('createNewDesign', (state, newDesign) => {
     // This assumes layerImages, surfaces, and palettes already exist in firebase.
     var now = new Date().getTime()
     var design = newDesign.toJS()
     var layerIds = design.layers.map((layer, i) => {
       layer.order = i
       layer.colorPalette = layer.colorPalette.id
       layer.selectedLayerImage = layer.selectedLayerImage.id
       layer.createdAt = now
       layer.updatedAt = now
       layer.layerImages = reactor.evaluate(getters.layerImageIds).toJS()
       var newLayerRef = layersRef.push(layer)
       return newLayerRef.key()
     })
     design.layers = layerIds
     design.surface = design.surface.id
     design.price = 2000
     design.createdAt = now
     design.updatedAt = now
     designsRef.push(design)
     return state
   })

 }
})

stores.currentDesignIdStore = new Nuclear.Store({
  getInitialState() { return '' },

  initialize() {
    this.on('selectDesignId', (state, designId) => {
      var designs = reactor.evaluate(['designs'])
      if (!designs.has(designId)) {
        designsRef.child(designId).on('value', (design) => {
          design = design.val()
          design.id = designId
          hydrateDesign(design)
        })
      }
      return designId
    })
  }
})

stores.colorPalettesStore = new Nuclear.Store({
  getInitialState() {
    return Nuclear.toImmutable({});
  },

  initialize() {
   this.on('addColorPalette', function(state, colorPalette) {
     return state.set(colorPalette.id, Nuclear.Immutable.fromJS(colorPalette));
   })
 }
})

stores.layerImagesStore = new Nuclear.Store({
  getInitialState() { return Nuclear.toImmutable({}); },
  initialize() {
   this.on('addLayerImage', function(state, layerImage) {
     return state.set(layerImage.id, Nuclear.Immutable.fromJS(layerImage));
   })
 }
})

stores.currentLayerIdStore = new Nuclear.Store({
  getInitialState() { return '' },
  initialize() {
    this.on('selectLayerId', (state, layerId) => layerId)
  }
})

stores.surfacesStore = new Nuclear.Store({
  getInitialState() { return Nuclear.toImmutable({}) },
  initialize() {
   this.on('addSurface', function(state, surface) {
     return state.set(surface.id, Nuclear.Immutable.fromJS(surface))
   })
 }
})

export default stores
