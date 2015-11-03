import { Set, Map, List } from 'Immutable'
import {nonOptionKeys} from 'state/helpers'
import {numTagsInCommon} from 'state/utils'
var getters = {}

getters.designs = [['designs'], designsMap => designsMap.toList()]
getters.adminCreatedDesigns = [
  getters.designs,
  designs => designs.filter(d => d.get('adminCreated'))
]

getters.currentDesign = [
  ['currentDesignId'],
  ['designs'],
  (currentDesignId, designsMap) => designsMap.get(currentDesignId)
]

getters.currentDesignPrice = [
  getters.currentDesign,
  (currentDesign) => {
    return ( currentDesign ?
      (currentDesign.getIn(['surfaceOption', 'salePrice']) / 100).toFixed(2)
      : ''
    )
  }
]

getters.shippingPrice = [
  ['cart'],
  (cart) => {
    var price = cart.get('shippingPrice')
    return price ? Number(price).toFixed(2) : null
  }
]

getters.cartTotalPrice = [
  getters.shippingPrice,
  getters.currentDesignPrice,
  (shippingPrice, designPrice) => (
    shippingPrice != null
      ? (Number(shippingPrice) + Number(designPrice)).toFixed(2)
      : designPrice
  )
]

getters.cartTotalPriceInCents = [
  getters.shippingPrice,
  getters.currentDesignPrice,
  (shippingPrice, designPrice) => (
    shippingPrice != null
      ? ( (Number(shippingPrice) * 100) + ((Number(designPrice)) * 100) )
      : designPrice * 100
  )
]

getters.numEnabledLayers = [
  getters.currentDesign,
  (currentDesign) => {
    return ( currentDesign ?
      currentDesign.get('layers').filter(l => l.get('isEnabled')).count()
      : -1
    )
  }
]

getters.colorPalettes = [['colorPalettes'],
  palettes => palettes.toList().sort((colorOne, colorTwo) => (
    colorTwo.get('createdAt') - colorOne.get('createdAt'))
  )
]

getters.currentLayer = [
  ['currentLayerId'],
  getters.currentDesign,
  (layerId, design) => design ? design.get('layers').find(v => v.get('id') === layerId) : null
]

getters.currentLayersMap = [
  getters.currentDesign,
  design => (
    design.get('layers').reduce((retVal, layer) => (
      retVal.set(layer.get('id'), layer)
    ), Map()))
]

getters.currentPalette = [
  getters.currentLayer,
  (currentLayer) => currentLayer ? currentLayer.get('colorPalette') : null
]

getters.currentLayerImage = [
  getters.currentLayer,
  (currentLayer) => (
    currentLayer ? currentLayer.get('selectedLayerImage') : null)
]

getters.layerImagesUnsorted = [
  ['layerImages'], layerImages => layerImages.toList()
]

getters.layerImages = [
  ['layerImages'], layerImages => (
    layerImages
      .toList()
      .filter(layerImage => layerImage)
      .sort((imageOne, imageTwo) => imageTwo.get('createdAt') - imageOne.get('createdAt'))
  )
]

getters.layerImagesForCurrentLayer = [
  getters.currentLayer,
  getters.layerImages,
  (layer, layerImages) => {
    if (layer == null) { return List() }
    if (layer.has('orderedLayerImages')) {
      return layer.get('orderedLayerImages')
    }
    return layerImages.sort((li1, li2) => (
      numTagsInCommon(layer, li2) - numTagsInCommon(layer, li1)
    ))
  }
]

getters.layerImagesCurrentIndex = [
  getters.currentLayer,
  getters.layerImagesForCurrentLayer,
  (layer, images) => {
    var index = layerImagesForCurrentLayer.findIndex(i.get('id') === currentLayer.getIn(['selectedLayerImage', 'id']))
    console.log('got index: ', index)
    return index
  }
]

getters.layerImageIds = [
  getters.layerImages, layerImages => layerImages.map(li => li.get('id'))
]

getters.surfaces = [
  ['surfaces'], surfaces => surfaces ? surfaces.toList() : List()
]

getters.currentSurfaceOptionsMap = [
  getters.currentDesign,
  (design) => {
    if (!design) { return null }
    var surfaceOption = design.get('surfaceOption')
    var surfaceOptions = design.getIn(['surface', 'options'])
    var nonOptionKeysSet = Set(nonOptionKeys)
    var optionKeys = Set.fromKeys(surfaceOption).subtract(nonOptionKeysSet).toList()
    return optionKeys.reduce((retVal, key) => {
      var index = optionKeys.indexOf(key)
      var values = surfaceOptions.reduce((retSet, o) => {
        var propsToFilterWith = optionKeys.slice(0, index)
        if (propsToFilterWith.every(prop => o.get(prop) === surfaceOption.get(prop))) {
          return retSet.add(o.get(key))
        }
        return retSet
      }, Set())
      return retVal.set(key, values.toList())
    }, Map())
  }
]

getters.layerImageOptions = [
  getters.currentLayer,
  ['layerImages'],
  (layer, layerImages) => {
    if (layer == null) {return null}
    return (
      layer.get('layerImages')
        .map(li => layerImages.get(li))
    )
  }
]

getters.tags = [
  ['tags'], tags => tags ? tags.toList() : List()
]

getters.errors = [
  ['errors'], errors => errors ? errors.toList() : List()
]

getters.orderIsBeingCreated = [
  ['cart'], cart => cart.get('orderIsBeingCreated')
]

getters.orderWasCreatedSuccessfuly = [
  ['cart'], cart => cart.get('orderWasCreatedSuccessfully')
]

getters.orderCreatedId = [
  ['cart'], cart => cart.get('orderId')
]

export default getters
