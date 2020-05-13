import React, {useContext, Component} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import { ListItem } from 'react-native-elements'
import {useSafeArea} from 'react-native-safe-area-context';
import {LocalizationContext} from '../components/Translations';




class Settings extends Component {
	
	static contextType = LocalizationContext;
	
	
    
	
	
	render() {
		const {
		    translations,
		    appLanguage,
		    setAppLanguage,
		    initializeAppLanguage,
		  } = this.context;
		  
		  //initializeAppLanguage();
		  
		return (
			<>
				<SafeAreaView style={styles.status_bar} />
    <View style={[styles.container, {}]}>
      <Text h4 h4Style={styles.language}>
        {translations['settings.change_language']} {/* 3 */}
      </Text>
		<Text h4 h4Style={styles.language}>
		{translations.getAvailableLanguages()[0]} {/* 3 */}
		</Text>
		{
			translations.getAvailableLanguages().map((currentLang, i)=>(
	  <ListItem
	            key={i}
	            title={currentLang}
	            bottomDivider
	            checkmark={appLanguage === currentLang}
	            onPress={() => {
	              setAppLanguage(currentLang);
	            }}
	          />
				
			))
			
		
		}
    </View>
			</>
		);
	}
	
}



const styles = StyleSheet.create({
  language: {
    paddingTop: 10,
    textAlign: 'center',
  },
});


export default Settings;

