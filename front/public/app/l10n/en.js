angular.module("app")

.constant("L10N_EN", {
	NAV_SIDE: {
		PROJECTS: "Projects",
		ADD_PROJECTS: "Add projects",
		TUTORIAL: {
			TITLE: "Tutorial",
			ANDROID: "Android",
			IOS: "IOS",
			UNITY: "Unity",
			CORDOVA: "Cordova"
		}
	} ,
	DETAIL_NAV_SIDE : {
		DASHBOARD: "Dashboard",
		ERRORS: "Errors",
		STATISTICS: "Statistics",
		SETTINGS: {
			TITLE: "Settings",
			GENERAL: "General",
			VIEWER: "Viewer",
			SYMBOLICATE: "Symbolicate"
		}
	},
	PROJECTS: {
		PLATFORM: {
			1: "Android",
			2: "iOS",
			3: "Unity",
			4: "Cordova",
			5: "JavaScript"
		},

		PLATFORM_ICON: {
			1: "fa-android",
			2: "fa-apple",
			3: "",
			4: "",
			5: ""
		},

		STAGE: {
			1: "Develop",
			2: "Test",
			3: "Release"
		}
	}
});
