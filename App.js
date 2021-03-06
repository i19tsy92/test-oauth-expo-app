import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import * as WebBrowser from 'expo-web-browser';
import {ajax} from 'rxjs/ajax';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { StyleSheet, Text, View, Button } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://oauth.vk.com/authorize',
};

export default function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      usePKCE: false,
      clientId: '7786221', //app id 
      scopes: ['email'], //permissions
      // For usage in managed apps using the proxy
      redirectUri: makeRedirectUri({
        // For usage in bare and standalone
        native: 'test.oauth://redirect', //test.oauth set in app.json for android and ios
      }),
      responseType: 'code'
    },
    discovery
  );

  React.useEffect(() => {
    console.log(response);
    if (response?.type === 'success') {
      const { code } = response.params;
      // get request to backend 
      ajax.getJSON("https://spring-oauth-vk.herokuapp.com/callback/vk?code=" + code).subscribe(
        value => console.log(value), //response body (access_token, expires_id, user_id)
        error => console.log("Error:" + error),
        () => console.log("Completed"), 
      ) 
      }
  }, [response]);



  return (
    <View
      style={{}}
    > <Text
      style={{width: 512, height: 512}}
    >
    </Text>
      <Button
        style={{width: 512, height: 512,  flex: 1,
          justifyContent: 'center',
          alignItems: 'center',}}
        disabled={!request}
        title="VK"
        onPress={() => {
          promptAsync();
        }}
    />
    </View>
    
  );
}
