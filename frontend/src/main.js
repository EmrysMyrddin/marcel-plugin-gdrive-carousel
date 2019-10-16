import 'marcel-plugin'
const api = (driveFolderId, apikey) => `https://www.googleapis.com/drive/v3/files?q='${driveFolderId}'+in+parents&key=${apikey}`
const img = (id, apikey) => `https://drive.google.com/uc?export=view&id=${id}&key=${apikey}`

class MarcelPluginGdriveCarousel extends Marcel.Plugin {
  constructor() {
    super({
      defaultProps: {
        duration: 60,
        saveProportions: true,
      }
    })

    this.img = document.getElementById('img')
  }

  async fetchPhotos() {
    const { driveFolderId, apikey } = this.props
    try {
      const response = await fetch(api(driveFolderId, apikey))
      if(!response.ok) {
        console.error(response)
        throw new Error('error while fetching list of photos')
      }

      this.setPhotos(await response.json())
      this.nextPhoto()
    }catch(err) {
      console.error(err)
    }
  }

  setPhotos(directory) {
    const { apikey } = this.props
    this.availablePhotos = directory.files.map(({ id }) => img(id, apikey))
    this.currentPhoto = 0
    console.log("Photos found : ", this.availablePhotos)
  }

  nextPhoto() {
    const { duration } = this.props

    if (this.currentPhoto == this.availablePhotos.length - 1) this.currentPhoto = 0
    else this.currentPhoto++

    this.img.src = this.availablePhotos[this.currentPhoto]

    console.log("Next photo : ", this.img.src)

    this.nextTimeout = setTimeout(() => this.nextPhoto(), (duration || 30) * 1000)
  }

  propsDidChange(prevProps) {
    if (this.props.apikey !== prevProps.apikey || this.props.driveFolderId !== prevProps.driveFolderId) {
      clearTimeout(this.nextTimeout)
      this.fetchPhotos()
    }
  }

  render() {
    this.img.className = this.props.saveProportions ? 'proportional' : ''
  }
}

Marcel.init(MarcelPluginGdriveCarousel)

// uncomment this line to try the plugin in a browser :
// Marcel.changeProps({})
