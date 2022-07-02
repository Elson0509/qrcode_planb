import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
} from 'react-native'
import AccessList from '../../components/AccessList'
import HeaderFilter from '../../components/HeaderFilter'
import * as Utils from '../../services/util'
import api from '../../services/api'
import ModalAccessFilter from '../../components/ModalAccessFilter'
import AccessReport from '../../components/AccessReport'

const Access = props => {
  const currentDate = new Date()

  const [accesses, setAccesses] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [dateInit, setDateInit] = useState({ day: currentDate.getDate(), month: currentDate.getMonth() + 1, year: currentDate.getFullYear() })
  const [dateEnd, setDateEnd] = useState({ day: currentDate.getDate(), month: currentDate.getMonth() + 1, year: currentDate.getFullYear() })
  const [title, setTitle] = useState('Últimos acessos')
  const [modal, setModal] = useState(false)

  useEffect(() => {
    const fetchEvents = async _ => {
      if (await Utils.handleNoConnection(setLoading)) return
      setLoading(true)

      api.get(`api/access/paginate/${page}`)
        .then(resp => {
          setAccesses(accesses.concat(resp.data.rows))
          setLastPage(resp.data.pages)
        })
        .catch(err => {
          Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (A1)')
        })
        .finally(() => {
          setLoading(false)
        })
    }
    fetchEvents()
  }, [page])

  const endReachedHandler = _ => {
    if (page < lastPage) {
      setPage(prev => prev + 1)
    }
  }

  const selectedDatesHandler = _ => {
    setModal(false)
    setLoading(true)

    const dateInicial = new Date(dateInit.year, dateInit.month - 1, dateInit.day, 0, 0, 0)
    const dateFinal = new Date(dateEnd.year, dateEnd.month - 1, dateEnd.day, 23, 59, 59)

    api.post('api/access/filter', { selectedDateInit: dateInicial, selectedDateEnd: dateFinal })
      .then(resp => {
        setAccesses(resp.data)
        setLastPage(0)
        setTitle('Acessos (' + Utils.printDate(dateInicial) + ' - ' + Utils.printDate(dateFinal) + ')')
      })
      .catch(err => {
        Utils.toastTimeoutOrErrorMessage(err, err.response?.data?.message || 'Um erro ocorreu. Tente mais tarde. (A2)')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <SafeAreaView style={styles.body}>
      <HeaderFilter
        title={title}
        action={ () => setModal(true)}
      />
      {
        accesses.length > 0 &&
        <View>
          <AccessReport accesses={accesses} title={title}/>
        </View>
      }
      {
        accesses.length === 0 && !loading &&
        <Text style={styles.listText}>Não há acessos registrados.</Text>
      }
      {
        accesses.length > 0 &&
        <AccessList page={page} accesses={accesses} title={title} endReachedHandler={endReachedHandler} />
      }
      {
        !!loading &&
        <ActivityIndicator size="large" color="white" />
      }
      <ModalAccessFilter
        modal={modal}
        dateInit={dateInit}
        setDateInit={setDateInit}
        dateEnd={dateEnd}
        setDateEnd={setDateEnd}
        setModal={setModal}
        selectedDatesHandler={selectedDatesHandler}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerFilter: {
    color: '#004999',
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    backgroundColor: '#EDEDED',
    flex: 1
  },
  listText: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Access