import React from 'react'
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native'
import * as Utils from '../../services/util'
import { USER_KIND_NAME } from '../../services/constants'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import Icon from '../Icon'

const AccessReport = (props) => {
  const getAccess = accessinfo => {
    return `<span>
      <p class="bold">Usuários</p>
      ${
        accessinfo.UserAccesses.map((ac, ind)=> {
          return (
            `<div>
              <p class="margin-top margin-bottom-zero">${ind+1}. ${ac.name}</p>
              ${!!ac.identification ? `<p class="nomargin">ID: ${ac.identification}</p>` : ''}
              ${!!ac.company ? `<p class="nomargin">Empresa: ${ac.company}</p>` : ''}
            </div>`
          )
        }).join('')
      }
      ${!!accessinfo.VehicleAccesses?.length && `<p class="bold">Veículos</p>`}
      ${
        !!accessinfo.VehicleAccesses?.length && accessinfo.VehicleAccesses.map((va, ind)=> {
          return (
            `
            <div>
              <p class="margin-top margin-bottom-zero">${ind+1}.${va.maker} ${va.model} ${va.color}</p>
              <p class="nomargin">Placa: ${va.plate}</p>
            </div>
            `
          )
        }).join('')
      }
    </span>`
  }

  const generateHTML = _ => {
    let html = `
      <html>
        <head>
          <style>
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              text-align: left;
              padding: 4px;
            }
            tr:nth-child(even){background-color: #f2f2f2}
            .nomargin {
              margin: 0;
            }
            .margin-bottom {
              margin-bottom: 10px;
            }
            .margin-bottom-zero {
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
          </style>
        </head>
        <body>
          <div class="div-center">
            <img class="img" src="https://drive.google.com/uc?export=view&id=1nEUQD6m0qXsAJ1WEjHQf54XIxTMVgg7C" />
          </div>
          <h2 class="align-center">${props.title}</h2>
          <table>
            <thead>
              <tr>
                <th>
                  #
                </th>
                <th>
                  Horário
                </th>
                <th>
                  Registro
                </th>
                <th>
                  Acesso
                </th>
                <th>
                  Tipo
                </th>
                <th>
                  Unidade
                </th>
                <th>
                  Controlador de Acesso
                </th>
              </tr>
            </thead>
            <tbody>
            `
    props.accesses.forEach((access, index) => {
      html += `
              <tr class="font-size-small">
                <th scope="row">
                  ${index+1}
                </th>
                <td>
                  ${Utils.printDateAndHour(new Date(access.updatedAt))}
                </td>
                <td>
                  ${access.TypeAccess.type}
                </td>
                <td>
                  ${getAccess(access)}
                </td>
                <td>
                  ${USER_KIND_NAME[access.user_kind_id]}
                </td>
                <td>
                  <span>Bloco ${access.bloco_name}<br />Unidade ${access.unit_number}</span>
                </td>
                <td>
                  ${access.ControllerAccess.name} <br /><i>${USER_KIND_NAME[access.ControllerAccess.user_kind_id]}</i>
                </td>
              </tr>
              `
    })
      html +=`
            </tbody >
          </table >
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

export default AccessReport;