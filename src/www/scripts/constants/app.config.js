lt.constant('appConfig', {
	env: "prod",
	settings: {

	},
	common:{
		appId: "testMode",
		analyticsMobileId: "",
		analyticsWebId: "",
		/*facebookAppId: "608595505935483",
		facebookPermission: ["email"],*/
		gameVersion: "0.0.1",
		/*adcolony: {
			android: {
				appId: "app6fc5f3220b004ffa8f",
				fullScreenAdZoneId: "vz215e0fa20ea7486fb6",
				rewardedVideoAdZoneId: "vzcfbf42e272a746288f"
			},
			ios:
			{
				appId: "app3360349e512b4b3086",
				fullScreenAdZoneId: "vz000609fc7842472eaa",
				rewardedVideoAdZoneId: "vza1a377bf01234186aa"
			}
		},
		chartboost: {
			ios: {
				appId: "56066d7cf6cd453da119b723",
				appSignature: "bff25eee79157d00169ae569595c28e0ac628cb6"
			},
			android: {
				appId: "5606742043150f2da3c5b28c",
				appSignature: "772bb874b6db67aea01cf5cc67fa3faf4e8c743c"
			}

		}*/
	},
	dev: {
		webserviceUrl: "http://localhost:9996",
	},
	prod: {
		webserviceUrl: "",
	}
});
