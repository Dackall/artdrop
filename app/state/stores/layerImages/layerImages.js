import Nuclear from 'nuclear-js'
import Immutable from 'Immutable'
import reactor from 'state/reactor'
import getters from 'state/getters'
import {numTagsInCommon, uploadImgToS3} from 'state/utils'
import {layerImagesRef} from 'state/firebaseRefs'
import {hydrateAndDispatchLayerImages} from 'state/helpers'

var recomputeLayersLayerImages = () => {
  var currentDesign = reactor.evaluate(getters.currentDesign)
  if (currentDesign == null || (typeof currentDesign.getIn(['layers', 0]) === 'string')) {
    setTimeout(() => recomputeLayersLayerImages(), 50)
    return
  }
  var allLayerImages = reactor.evaluate(getters.layerImagesUnsorted)
  if (allLayerImages.count() === 3) {
    setTimeout(() => recomputeLayersLayerImages(), 50)
    return
  }
  var updatedLayers = currentDesign.get('layers').map(layer => {
    var orderedLayerImages = allLayerImages.sort((li1, li2) => {
      return numTagsInCommon(layer, li2) - numTagsInCommon(layer, li1)
    })
    var selectedLayerImageId = layer.getIn(['selectedLayerImage', 'id'])
    var index = orderedLayerImages.findIndex(li => li.get('id') === selectedLayerImageId)
    return (layer.set('orderedLayerImages', orderedLayerImages)
                 .set('selectedLayerImageIndex', index))
  })
  reactor.dispatch('setDesignImm', currentDesign.set('layers', updatedLayers))
}

export default new Nuclear.Store({
  getInitialState() { return Nuclear.toImmutable({}) },

  newLayerImageObj(filename, baseImageUrl, compositeImageUrl, compositeFilename) {
    var now = new Date().getTime()
    var retVal = {
      filename: filename,
      imageUrl: baseImageUrl,
      validOrders: [0,1,2],
      createdAt: now,
      updatedAt: now}
    if (compositeImageUrl) {
      retVal.compositeImageUrl = compositeImageUrl
      retVal.compositeFilename = compositeFilename
    }
    return retVal
  },

  initialize() {
    this.on('setLayerImage', (state, layerImage) => {
      return state.set(layerImage.id, Immutable.fromJS(layerImage))
    })

    this.on('addManyLayerImages', (state, layerImages) => {
      setTimeout(() => recomputeLayersLayerImages(), 50)
      return layerImages.reduce((retVal, layerImage) => (
        retVal.set(layerImage.id, Immutable.fromJS(layerImage))), state)
    })

    this.on('setManyImmLayerImages', (state, layerImages) => (
      layerImages.reduce((retVal, layerImage) => (
        retVal.set(layerImage.get('id'), layerImage)), state)))

    this.on('removeLayerImage', (state, layerImageId) => (
      state.delete(layerImageId)))

    this.on('loadCurrentDesignEditResources', state => {
      hydrateAndDispatchLayerImages()
      return state
    }),

    this.on('loadAdminLayerImages', state => {
      hydrateAndDispatchLayerImages()
      return state
    })

    this.on('loadAdminCreateDesignData', state => {
      hydrateAndDispatchLayerImages()
      return state
    })

    this.on('uploadLayerImageWithCompositeToS3', (state, files) => {
      var baseFile = files.base
      var topFile = files.top
      uploadImgToS3(baseFile, baseFile.name,  'image/svg+xml', (err, baseImageUrl) => {
        if (err) {
          console.log('got err: ', err)
        } else {
          uploadImgToS3(topFile, topFile.name,  'image/svg+xml', (err, topImageUrl) => {
            if (err) {
              console.log('got err: ', err)
            } else {
              var newLayerImage = this.newLayerImageObj(baseFile.name, baseImageUrl, topImageUrl, topFile.name)
              var newLayerImageRef = layerImagesRef.push(newLayerImage)
              var layerImageId = newLayerImageRef.key()
              newLayerImage.id = layerImageId
              reactor.dispatch('setLayerImage', newLayerImage)
              var layerImageImm = Immutable.fromJS(newLayerImage)
              reactor.dispatch('layerImageUploadedSuccessfully', layerImageImm)
            }
          }.bind(this))
        }
      }.bind(this))
      return state
    })

  }
})
