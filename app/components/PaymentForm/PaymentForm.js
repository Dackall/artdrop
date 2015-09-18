import React from 'react'
import Router from 'react-router'
import RenderLayers from 'components/Design/RenderLayers/RenderLayers'
import reactor from 'state/reactor'
import Store from 'state/main'
import getters from 'state/getters'
import {iconPath} from 'utils'
import EmailField from './EmailField/EmailField'
import GiftIcon from './GiftIcon/GiftIcon'
import OfferCodeField from './OfferCodeField/OfferCodeField'
import CCIcons from './CCIcons/CCIcons'
import CreditCardField  from './CreditCardField/CreditCardField'
import ExpiryDateField  from './ExpiryDateField/ExpiryDateField'
import NameField  from './NameField/NameField'
import AddressField  from './AddressField/AddressField'
import CityField from './CityField/CityField'
import ZipcodeField from './ZipcodeField/ZipcodeField'
import PayPalButton from './PayPalButton/PayPalButton'
import CVCodeField from './CVCodeField/CVCodeField'
import StateField from './StateField/StateField'

export default React.createClass({

  render() {
    return (
      <div className="form-container">
        <form>
          <div className="envelope">
            <p style={{position:'relative'}}>
              <EmailField placeholder="Your email address" onChange={this.handleEmailChange}
                  onInvalidInput={this.onInvalidEmail}/>
              <GiftIcon />
            </p>

            <p>
              <OfferCodeField placeholder="PLace" onChange={this.handleEmailChange}
                  onInvalidInput={this.onInvalidEmail}/>
            </p>
          </div>

          <div className="credit_card_holder">
            <div className="stripe-card-info">
              <h2>Shipping Info</h2>
            </div>
            <p><NameField /></p>
            <p><AddressField /></p>
            <p className="exp-cv-container">
              <CityField />
              <StateField />
            </p>
            <p> <ZipcodeField /> </p>
          </div>

          <div className="credit_card_holder">
            <div className="stripe-card-info">
              <CCIcons />
              <PayPalButton />
            </div>
            <p><CreditCardField /></p>
            <p><NameField /></p>
            <p className="exp-cv-container">
              <ExpiryDateField />
              <CVCodeField />
            </p>
          </div>

          <p><button className="pay-button">Pay</button></p>
        </form>
      </div>
    )
  }
});
