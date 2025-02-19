const getCleanedJamboInjectedData = require('../static/webpack/getCleanedJamboInjectedData');
const packageJson = require('../package.json');
const customDataJson = require('../customData.json');

/**
 * Formats the data sent to the handlebars templates during Jambo builds.
 *
 * @param {string} pageMetadata.relativePath relativePath from the page to the output dir
 * @param {string} pageMetadata.pageName name of the page being build
 
 * @param {Object} siteLevelAttributes.globalConfig global_config.json
 * @param {Object} siteLevelAttributes.currentLocaleConfig the chunk of locale config for the current locale
 * @param {string} siteLevelAttributes.locale the current locale
 * @param {Object} siteLevelAttributes.env all environment variables, like JAMBO_INJECTED_DATA
 * 
 * @param {Object} pageNameToConfig object of pageName to pageConfig
 * @returns {Object}
 */
module.exports = function (pageMetadata, siteLevelAttributes, pageNameToConfig) {
  const { relativePath, pageName } = pageMetadata;
  const { globalConfig, currentLocaleConfig, locale, env } = siteLevelAttributes;
  const currentPageConfig = pageNameToConfig[pageName];
 
  let customResult = "";
  /* let customData = getApiData().then(function(result) {				
				 console.log('result  dd', result);	
         customResult = 	result;							
	});	
  */

  // console.log('customData', customDataJson);  
  
  const templateData = {
    ...currentPageConfig,
    verticalConfigs: pageNameToConfig,
    customData: customDataJson,
    global_config: getLocalizedGlobalConfig(globalConfig, currentLocaleConfig, locale),    
    params: currentLocaleConfig.params || {},
    relativePath,
    env: {
      JAMBO_INJECTED_DATA: env.JAMBO_INJECTED_DATA,
      packageJsonVersion: packageJson.version
    }
  };
  if (globalConfig.useJWT) {
    return getCleanedTemplateData(templateData);
  }
  return templateData;
}

/**
 * Gets the global config, with experienceKey and locale added
 * to it.
 * 
 * @param {Object} globalConfig 
 * @param {Object} currentLocaleConfig chunk of locale config for the current locale
 * @param {string} locale the current locale
 * @returns {Object}
 */
function getLocalizedGlobalConfig(globalConfig, currentLocaleConfig, locale) {
  const localizedGlobalConfig = {
    ...globalConfig
  };
  const { experienceKey } = currentLocaleConfig;
  if (experienceKey) {
    localizedGlobalConfig.experienceKey = experienceKey;
  }
  if (locale) {
    localizedGlobalConfig.locale = locale;
  }
  return localizedGlobalConfig;
}

async function getApiData() {

    const fetchGetJSON = {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
      }
    };
    
    var request_url = 'https://jsonplaceholder.typicode.com/todos/1';    
    // return response = await fetch(request_url);
    return new Promise((async (resolve, reject) => {
        /*fetch(request_url, fetchGetJSON ).then((res) => res.json()).then(function(data) {
             console.log('fetch data', data); 
             resolve(data.title); 			   
        }).catch((err) => {
        });*/

        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;  
        var xhr = new XMLHttpRequest();      
        var url = 'https://jsonplaceholder.typicode.com/todos/1';
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            console.log('responseText',this.responseText);                
            // return this.responseText;
            resolve(this.responseText); 	
          }
        }       
        xhr.send();

    })); 

  }

function getCustomApiData() { 
        let data = "h"; 
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;  
        var xhr = new XMLHttpRequest();      
        var url = 'https://jsonplaceholder.typicode.com/todos/1';
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              // console.log('responseText fdfff',this.responseText);                
              data = this.responseText;
            }
        }       
        xhr.send();
        return data; 
}
/**
 * Returns the provided template data without the API Key
 * 
 * @param {Object} templateData 
 * @returns {Object}
 */
function getCleanedTemplateData(templateData) {
  const jamboInjectedData = templateData.env.JAMBO_INJECTED_DATA;
  const globalConfig = templateData.global_config;
  return {
    ...templateData,
    global_config: {
      ...globalConfig,
      apiKey: undefined
    },
    env: {
      ...templateData.env,
      JAMBO_INJECTED_DATA: getCleanedJamboInjectedData(jamboInjectedData)
    }
  }
}