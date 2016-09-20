import "expose?promise!../libs/es6-promise.min";
import axios from "expose?axios!imports?promise=>global.promise!axios";
import "expose?CryptoJS!exports?CryptoJS!../libs/aws/lib/CryptoJS/rollups/hmac-sha256";
import "expose?CryptoJS!exports?CryptoJS!../libs/aws/lib/CryptoJS/rollups/sha256";
import "imports?CryptoJS=>global.CryptoJS!../libs/aws/lib/CryptoJS/components/hmac";
import "imports?CryptoJS=>global.CryptoJS!../libs/aws/lib/CryptoJS/components/enc-base64";
import "expose?uritemplate!exports?uritemplate!../libs/aws/lib/url-template/url-template";
import "expose?apiGateway!exports?apiGateway!../libs/aws/lib/apiGatewayCore/sigV4Client";
import "expose?apiGateway!imports?apiGateway=>global.apiGateway!exports?apiGateway!../libs/aws/lib/apiGatewayCore/apiGatewayClient";
import "expose?apiGateway!imports?apiGateway=>global.apiGateway!exports?apiGateway!../libs/aws/lib/apiGatewayCore/simpleHttpClient";
import "expose?apiGateway!imports?apiGateway=>global.apiGateway!exports?apiGateway!../libs/aws/lib/apiGatewayCore/utils";
import apigClientFactory from "exports?apigClientFactory!../libs/aws/apigClient";

// define hooks
const apiHooks = {

	progress: evt => {

		// Do whatever you want with the native progress event
		console.log("Progress:", parseFloat(100 / evt.total * evt.loaded).toFixed(2));
	}
};

// wire up hooks
axios.interceptors.request.use(config => {

	config.timeout = 90000;

	if (apiHooks.progress) {

		// this needs to be done because the api gateway client from aws
		// always capitalizes the method the axios client needs them in
		// lower case to trigger the progress handler (method === 'post')
		config.method = config.method.toLowerCase();

		// attach the progress handler from the hooks object
		config.progress = apiHooks.progress;
	}

	return config;
});

export default apigClientFactory;
export {apiHooks};
