import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/auth';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes'
import { View, ActivityIndicator } from 'react-native'

const Routes = () => {
  const { signed, loading, pushToken } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    )
  }

  return signed ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;