import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import * as Utils from '../../services/util'
import { PREFIX_IMG_GOOGLE_CLOUD, USER_KIND_NAME } from '../../services/constants'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import Icon from '../Icon'

const EventsReport = (props) => {

  const getEventHTML = eventinfo => {
    return `
      <div class='margin-bottom padding break-inside border'>
        <div class='images'>
          ${eventinfo.OccurrenceImages.map((ev) => {
            return `
            <div>
              <img src="${PREFIX_IMG_GOOGLE_CLOUD + ev.photo_id}" class="img-pic" />
            </div>
            `
          }).join('')}
        </div>
        <div class="padding">
            ${!!eventinfo.OccurrenceType?.type && `<p class='margin-bottom-zero'><span class='bold'>Assunto:</span> ${eventinfo.OccurrenceType.type}</p>`}
            ${!!eventinfo.created_at && `<p class='margin-bottom-zero'><span class='bold'>Data:</span> ${Utils.printDateAndHour(new Date(eventinfo.created_at))}</p>`}
            ${!!eventinfo.place && `<p class='margin-bottom-zero'><span class='bold'>Local:</span> ${eventinfo.place}</p>`}
            ${!!eventinfo.userRegistering.name && `<p class='margin-bottom-zero'><span class='bold'>Quem registrou:</span> ${eventinfo.userRegistering.name} (${USER_KIND_NAME[eventinfo.userRegistering.user_kind_id]})</p>`}
            ${!!eventinfo.description && `<p class='margin-bottom-zero'><span class='bold'>Descrição:</span> ${eventinfo.description}</p>`}
        </div>
      </div>
    `
  }

  const generateHTML = _ => {
    let html = `
      <html>
        <head>
          <style>
            .margin-bottom {
              margin-bottom: 10px;
            }
            .margin-bottom-zero{
              margin-bottom: 0px;
            }
            .margin-top {
              margin-top: 10px;
            }
            .bold{
              font-weight: bold;
            }
            .font-size-small {
              font-size: 0.8em;
            }
            .align-center {
              text-align: center;
            }
            .div-center {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .img{
              width: auto; 
              height: 120px; 
            }
            .landscape{
              width: 100%;
              height: 100%;
              size: landscape;
              margin: 30px 0 30px 0;
              padding: 0;
            }
            .break-inside{
              break-inside: avoid;
              page-break-inside:avoid;
            }
            .padding{
              padding: 10px;
            }
            .img-pic{
              height: 200px;
              width: auto !important;
              cursor: pointer;
            }
            .images{
              display: flex;
              flex-wrap: wrap;
              flex-direction: row;
              justify-content: space-around;
              align-items: center;
              gap: 10px;
            }
            .border{
              border: 1px solid #0d6efd;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="div-center">
            <img class="img" src="https://drive.google.com/uc?export=view&id=1nEUQD6m0qXsAJ1WEjHQf54XIxTMVgg7C" />
          </div>
          <h2 class="align-center">${props.title}</h2>
          <div class="landscape">
          ${
            props.events.map(ev => {
              return getEventHTML(ev)
            }).join('')
          }
          </div>
        </body >
      </html >
  `
    return html
  }

  const execute = async () => {
    const html = generateHTML()

    const { uri } = await Print.printToFileAsync({ html });
    Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf', });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => execute()}>
        <View style={styles.share}>
          <Icon name="share-alt" size={24} color="#fff" />
          <Text style={styles.buttonText}>Compartilhar</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#004999',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  share: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default EventsReport;