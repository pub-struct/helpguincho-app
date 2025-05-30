import { IResultRides } from '@/@types/history'
import { Header } from '@/components/Header'
import { SafeArea } from '@/components/SafeArea'
import { handleErrors } from '@/services/errors/ErrorHandler'
import { useCallback, useEffect, useState } from 'react'
import { getHistory } from '../services/api'
import { View, ActivityIndicator, FlatList, ListRenderItemInfo } from 'react-native'
import { Text } from '@/components/Text'
import { THEME } from '@/theme'
import { Historic } from '../fragments/Historic'


export function History() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingFirst, setIsLoadingFirst] = useState<boolean>(true)
  const [history, setHistory] = useState<IResultRides[]>([])
  const [hasMoreData, setHasMoreData] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)

  const { COLORS } = THEME
  // console.log(page, history.length)
  async function getInfosFromServer() {
    if (isLoading || !hasMoreData) return

    try {
      setIsLoading(true)
      const response = await getHistory(page)

      setHistory(prev => [...prev, ...response.results])

      if (response.next === null) {
        return setHasMoreData(false)
      }

      setPage(prev => prev + 1)
    } catch (error) {
      handleErrors(error)
    } finally {
      setIsLoading(false)
    }
  }
  async function getInitialInfos() {
    try {
      getInfosFromServer()
    } catch (error) {
      handleErrors(error)
    } finally {
      setIsLoadingFirst(false)
    }
  }

  const renderItem = useCallback(({ item }: ListRenderItemInfo<IResultRides>) => (
    <Historic {...item} />
  ), [])
  const ListEmptyComponent = useCallback(() => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text weight='Bold_7'>Lista vazia...</Text>
    </View>
  ), [])
  const ListFooterComponent = useCallback(() => (
    isLoading ? <ActivityIndicator size={50} color={COLORS.PRIMARY} /> : null
  ), [isLoading])

  useEffect(() => {
    getInitialInfos()
  }, [])

  if (isLoadingFirst) {
    return (
      <SafeArea>
        <Header title='Histórico' backButton />

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size={50} color={COLORS.PRIMARY} />
          <Text weight='Bold_7'>Carregando...</Text>
        </View>
      </SafeArea>
    )
  }

  return (
    <SafeArea>
      <Header title='Histórico' backButton />

      <FlatList
        data={history}
        keyExtractor={(item, index) => item.id.toString() + index}
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        onEndReached={getInfosFromServer}
        onEndReachedThreshold={0.5}
      />
    </SafeArea>
  )
}
