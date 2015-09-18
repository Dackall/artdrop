import React from 'react'
import {Link} from 'react-router'
import {iconPath} from 'utils'
import Router from 'react-router'

export default React.createClass({
  mixins: [Router.State],

  handleGoBack(e) {
    e.preventDefault()
    window.history.back()
  },

  render() {
    var onDesigns = (this.isActive('designs'))
    return (
      <div className="Nav">
        <div className="Nav-container">

          <div className="Nav-left-side">
            {onDesigns ?
              <Link to="designs" className="logo">
                <img className="Nav-button" src={iconPath('drop.svg')} height={40} width={30}/>
              </Link>:
              null
            }   

            {onDesigns ? null:
              (<img src={iconPath('cancel-x-white.svg')}
                   className="cancel-x Nav-button"
                   height={30} width={30}/>)
            }

            {onDesigns ? null:
              (<img src={iconPath('back.svg')}
                  className="Nav-button"
                  height={30} width={30}
                  onClick={this.handleGoBack}/>)
            }
            
            {onDesigns ? null:
              (<img src={iconPath('refresh.svg')}
                   className="Nav-button"
                   height={30} width={30}
                   onClick={this.handleReset}/>)
            }
          </div>

          <div className="Nav-right-side">
            <div className="Nav-button">
              <img src={iconPath('share-icon.svg')} height={25} width={25}
                   style={{marginTop:4}}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
})