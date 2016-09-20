/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var apigClientFactory = {};
apigClientFactory.newClient = function (config) {
	var apigClient = {};
	if (config === undefined) {
		config = {
			accessKey: '',
			secretKey: '',
			sessionToken: '',
			region: '',
			apiKey: undefined,
			defaultContentType: 'application/json',
			defaultAcceptType: 'application/json'
		};
	}
	if (config.accessKey === undefined) {
		config.accessKey = '';
	}
	if (config.secretKey === undefined) {
		config.secretKey = '';
	}
	if (config.apiKey === undefined) {
		config.apiKey = '';
	}
	if (config.sessionToken === undefined) {
		config.sessionToken = '';
	}
	if (config.region === undefined) {
		config.region = 'us-east-1';
	}
	//If defaultContentType is not defined then default to application/json
	if (config.defaultContentType === undefined) {
		config.defaultContentType = 'application/json';
	}
	//If defaultAcceptType is not defined then default to application/json
	if (config.defaultAcceptType === undefined) {
		config.defaultAcceptType = 'application/json';
	}


	// extract endpoint and path from url
	var invokeUrl = 'https://htjxsq6ig0.execute-api.eu-west-1.amazonaws.com/test';
	var endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
	var pathComponent = invokeUrl.substring(endpoint.length);

	var sigV4ClientConfig = {
		accessKey: config.accessKey,
		secretKey: config.secretKey,
		sessionToken: config.sessionToken,
		serviceName: 'execute-api',
		region: config.region,
		endpoint: endpoint,
		defaultContentType: config.defaultContentType,
		defaultAcceptType: config.defaultAcceptType
	};

	var authType = 'NONE';
	if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
		authType = 'AWS_IAM';
	}

	var simpleHttpClientConfig = {
		endpoint: endpoint,
		defaultContentType: config.defaultContentType,
		defaultAcceptType: config.defaultAcceptType
	};

	var apiGatewayClient = apiGateway.core.apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);


	apigClient.rootOptions = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

		var rootOptionsRequest = {
			verb: 'options'.toUpperCase(),
			path: pathComponent + uritemplate('/').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(rootOptionsRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.applicationresponseDmksIdPost = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, ['dmks_id'], ['body']);

		var applicationresponseDmksIdPostRequest = {
			verb: 'post'.toUpperCase(),
			path: pathComponent + uritemplate('/applicationresponse/{dmks_id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['dmks_id'])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(applicationresponseDmksIdPostRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.archivefileresponseAbsNumberUekaIdPost = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, ['absNumber', 'uekaId'], ['body']);

		var archivefileresponseAbsNumberUekaIdPostRequest = {
			verb: 'post'.toUpperCase(),
			path: pathComponent + uritemplate('/archivefileresponse/{absNumber}/{uekaId}').expand(apiGateway.core.utils.parseParametersToObject(params, ['absNumber', 'uekaId'])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(archivefileresponseAbsNumberUekaIdPostRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.bankcontractresponsePost = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

		var bankcontractresponsePostRequest = {
			verb: 'post'.toUpperCase(),
			path: pathComponent + uritemplate('/bankcontractresponse').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(bankcontractresponsePostRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.generatePdfPost = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

		var generatePdfPostRequest = {
			verb: 'post'.toUpperCase(),
			path: pathComponent + uritemplate('/generate-pdf').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(generatePdfPostRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.generatePdfOptions = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

		var generatePdfOptionsRequest = {
			verb: 'options'.toUpperCase(),
			path: pathComponent + uritemplate('/generate-pdf').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(generatePdfOptionsRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.geolocationIpAdressGet = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, ['ipAdress'], ['body']);

		var geolocationIpAdressGetRequest = {
			verb: 'get'.toUpperCase(),
			path: pathComponent + uritemplate('/geolocation/{ipAdress}').expand(apiGateway.core.utils.parseParametersToObject(params, ['ipAdress'])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(geolocationIpAdressGetRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.heisenbergPost = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

		var heisenbergPostRequest = {
			verb: 'post'.toUpperCase(),
			path: pathComponent + uritemplate('/heisenberg').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(heisenbergPostRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.heisenbergOptions = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

		var heisenbergOptionsRequest = {
			verb: 'options'.toUpperCase(),
			path: pathComponent + uritemplate('/heisenberg').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(heisenbergOptionsRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.oscarPost = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

		var oscarPostRequest = {
			verb: 'post'.toUpperCase(),
			path: pathComponent + uritemplate('/oscar').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(oscarPostRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.oscarOptions = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

		var oscarOptionsRequest = {
			verb: 'options'.toUpperCase(),
			path: pathComponent + uritemplate('/oscar').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(oscarOptionsRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.piqsPost = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

		var piqsPostRequest = {
			verb: 'post'.toUpperCase(),
			path: pathComponent + uritemplate('/piqs').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(piqsPostRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.piqsOptions = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

		var piqsOptionsRequest = {
			verb: 'options'.toUpperCase(),
			path: pathComponent + uritemplate('/piqs').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(piqsOptionsRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.updownerPut = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

		var updownerPutRequest = {
			verb: 'put'.toUpperCase(),
			path: pathComponent + uritemplate('/updowner').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(updownerPutRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.updownerOptions = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

		var updownerOptionsRequest = {
			verb: 'options'.toUpperCase(),
			path: pathComponent + uritemplate('/updowner').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(updownerOptionsRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.updownerSessionIdFileIdDelete = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, ['session_id', 'file_id'], ['body']);

		var updownerSessionIdFileIdDeleteRequest = {
			verb: 'delete'.toUpperCase(),
			path: pathComponent + uritemplate('/updowner/{session_id}/{file_id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['session_id', 'file_id'])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(updownerSessionIdFileIdDeleteRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.updownerSessionIdFileIdOptions = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

		var updownerSessionIdFileIdOptionsRequest = {
			verb: 'options'.toUpperCase(),
			path: pathComponent + uritemplate('/updowner/{session_id}/{file_id}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(updownerSessionIdFileIdOptionsRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.zgpdataPost = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

		var zgpdataPostRequest = {
			verb: 'post'.toUpperCase(),
			path: pathComponent + uritemplate('/zgpdata').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(zgpdataPostRequest, authType, additionalParams, config.apiKey);
	};


	apigClient.zgpdataOptions = function (params, body, additionalParams) {
		if (additionalParams === undefined) {
			additionalParams = {};
		}

		apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

		var zgpdataOptionsRequest = {
			verb: 'options'.toUpperCase(),
			path: pathComponent + uritemplate('/zgpdata').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
			headers: apiGateway.core.utils.parseParametersToObject(params, []),
			queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
			body: body
		};


		return apiGatewayClient.makeRequest(zgpdataOptionsRequest, authType, additionalParams, config.apiKey);
	};


	return apigClient;
};
