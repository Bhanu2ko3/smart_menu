/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./src/components/DarkModeToggle.jsx":
/*!*******************************************!*\
  !*** ./src/components/DarkModeToggle.jsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ DarkModeToggle)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* __next_internal_client_entry_do_not_use__ default auto */ \n\nfunction DarkModeToggle() {\n    const [darkMode, setDarkMode] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"DarkModeToggle.useEffect\": ()=>{\n            // Check localStorage for saved theme\n            const savedTheme = localStorage.getItem(\"theme\");\n            if (savedTheme === \"dark\") {\n                setDarkMode(true);\n                document.documentElement.classList.add(\"dark\");\n            }\n        }\n    }[\"DarkModeToggle.useEffect\"], []);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"DarkModeToggle.useEffect\": ()=>{\n            if (darkMode) {\n                document.documentElement.classList.add(\"dark\");\n                localStorage.setItem(\"theme\", \"dark\");\n            } else {\n                document.documentElement.classList.remove(\"dark\");\n                localStorage.setItem(\"theme\", \"light\");\n            }\n        }\n    }[\"DarkModeToggle.useEffect\"], [\n        darkMode\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n        onClick: ()=>setDarkMode(!darkMode),\n        className: \"fixed top-4 right-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors\",\n        \"aria-label\": \"Toggle dark mode\",\n        children: darkMode ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"svg\", {\n            xmlns: \"http://www.w3.org/2000/svg\",\n            className: \"h-6 w-6 text-white\",\n            fill: \"none\",\n            viewBox: \"0 0 24 24\",\n            stroke: \"currentColor\",\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"path\", {\n                strokeLinecap: \"round\",\n                strokeLinejoin: \"round\",\n                strokeWidth: 2,\n                d: \"M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z\"\n            }, void 0, false, {\n                fileName: \"D:\\\\MY WORK\\\\HDSE24.1\\\\Final_Project\\\\smart_menu\\\\src\\\\components\\\\DarkModeToggle.jsx\",\n                lineNumber: 41,\n                columnNumber: 11\n            }, this)\n        }, void 0, false, {\n            fileName: \"D:\\\\MY WORK\\\\HDSE24.1\\\\Final_Project\\\\smart_menu\\\\src\\\\components\\\\DarkModeToggle.jsx\",\n            lineNumber: 34,\n            columnNumber: 9\n        }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"svg\", {\n            xmlns: \"http://www.w3.org/2000/svg\",\n            className: \"h-6 w-6 text-gray-700\",\n            fill: \"none\",\n            viewBox: \"0 0 24 24\",\n            stroke: \"currentColor\",\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"path\", {\n                strokeLinecap: \"round\",\n                strokeLinejoin: \"round\",\n                strokeWidth: 2,\n                d: \"M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z\"\n            }, void 0, false, {\n                fileName: \"D:\\\\MY WORK\\\\HDSE24.1\\\\Final_Project\\\\smart_menu\\\\src\\\\components\\\\DarkModeToggle.jsx\",\n                lineNumber: 56,\n                columnNumber: 11\n            }, this)\n        }, void 0, false, {\n            fileName: \"D:\\\\MY WORK\\\\HDSE24.1\\\\Final_Project\\\\smart_menu\\\\src\\\\components\\\\DarkModeToggle.jsx\",\n            lineNumber: 49,\n            columnNumber: 9\n        }, this)\n    }, void 0, false, {\n        fileName: \"D:\\\\MY WORK\\\\HDSE24.1\\\\Final_Project\\\\smart_menu\\\\src\\\\components\\\\DarkModeToggle.jsx\",\n        lineNumber: 28,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9jb21wb25lbnRzL0RhcmtNb2RlVG9nZ2xlLmpzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFFNEM7QUFFN0IsU0FBU0U7SUFDdEIsTUFBTSxDQUFDQyxVQUFVQyxZQUFZLEdBQUdKLCtDQUFRQSxDQUFDO0lBRXpDQyxnREFBU0E7b0NBQUM7WUFDUixxQ0FBcUM7WUFDckMsTUFBTUksYUFBYUMsYUFBYUMsT0FBTyxDQUFDO1lBQ3hDLElBQUlGLGVBQWUsUUFBUTtnQkFDekJELFlBQVk7Z0JBQ1pJLFNBQVNDLGVBQWUsQ0FBQ0MsU0FBUyxDQUFDQyxHQUFHLENBQUM7WUFDekM7UUFDRjttQ0FBRyxFQUFFO0lBRUxWLGdEQUFTQTtvQ0FBQztZQUNSLElBQUlFLFVBQVU7Z0JBQ1pLLFNBQVNDLGVBQWUsQ0FBQ0MsU0FBUyxDQUFDQyxHQUFHLENBQUM7Z0JBQ3ZDTCxhQUFhTSxPQUFPLENBQUMsU0FBUztZQUNoQyxPQUFPO2dCQUNMSixTQUFTQyxlQUFlLENBQUNDLFNBQVMsQ0FBQ0csTUFBTSxDQUFDO2dCQUMxQ1AsYUFBYU0sT0FBTyxDQUFDLFNBQVM7WUFDaEM7UUFDRjttQ0FBRztRQUFDVDtLQUFTO0lBRWIscUJBQ0UsOERBQUNXO1FBQ0NDLFNBQVMsSUFBTVgsWUFBWSxDQUFDRDtRQUM1QmEsV0FBVTtRQUNWQyxjQUFXO2tCQUVWZCx5QkFDQyw4REFBQ2U7WUFDQ0MsT0FBTTtZQUNOSCxXQUFVO1lBQ1ZJLE1BQUs7WUFDTEMsU0FBUTtZQUNSQyxRQUFPO3NCQUVQLDRFQUFDQztnQkFDQ0MsZUFBYztnQkFDZEMsZ0JBQWU7Z0JBQ2ZDLGFBQWE7Z0JBQ2JDLEdBQUU7Ozs7Ozs7Ozs7aUNBSU4sOERBQUNUO1lBQ0NDLE9BQU07WUFDTkgsV0FBVTtZQUNWSSxNQUFLO1lBQ0xDLFNBQVE7WUFDUkMsUUFBTztzQkFFUCw0RUFBQ0M7Z0JBQ0NDLGVBQWM7Z0JBQ2RDLGdCQUFlO2dCQUNmQyxhQUFhO2dCQUNiQyxHQUFFOzs7Ozs7Ozs7Ozs7Ozs7O0FBTWQiLCJzb3VyY2VzIjpbIkQ6XFxNWSBXT1JLXFxIRFNFMjQuMVxcRmluYWxfUHJvamVjdFxcc21hcnRfbWVudVxcc3JjXFxjb21wb25lbnRzXFxEYXJrTW9kZVRvZ2dsZS5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgY2xpZW50XCI7XHJcblxyXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEYXJrTW9kZVRvZ2dsZSgpIHtcclxuICBjb25zdCBbZGFya01vZGUsIHNldERhcmtNb2RlXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIC8vIENoZWNrIGxvY2FsU3RvcmFnZSBmb3Igc2F2ZWQgdGhlbWVcclxuICAgIGNvbnN0IHNhdmVkVGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRoZW1lXCIpO1xyXG4gICAgaWYgKHNhdmVkVGhlbWUgPT09IFwiZGFya1wiKSB7XHJcbiAgICAgIHNldERhcmtNb2RlKHRydWUpO1xyXG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImRhcmtcIik7XHJcbiAgICB9XHJcbiAgfSwgW10pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKGRhcmtNb2RlKSB7XHJcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZGFya1wiKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0aGVtZVwiLCBcImRhcmtcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImRhcmtcIik7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidGhlbWVcIiwgXCJsaWdodFwiKTtcclxuICAgIH1cclxuICB9LCBbZGFya01vZGVdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxidXR0b25cclxuICAgICAgb25DbGljaz17KCkgPT4gc2V0RGFya01vZGUoIWRhcmtNb2RlKX1cclxuICAgICAgY2xhc3NOYW1lPVwiZml4ZWQgdG9wLTQgcmlnaHQtNCB6LTUwIHAtMiByb3VuZGVkLWZ1bGwgYmctd2hpdGUgZGFyazpiZy1ncmF5LTgwMCBzaGFkb3ctbGcgaG92ZXI6YmctZ3JheS0yMDAgZGFyazpob3ZlcjpiZy1ncmF5LTcwMCB0cmFuc2l0aW9uLWNvbG9yc1wiXHJcbiAgICAgIGFyaWEtbGFiZWw9XCJUb2dnbGUgZGFyayBtb2RlXCJcclxuICAgID5cclxuICAgICAge2RhcmtNb2RlID8gKFxyXG4gICAgICAgIDxzdmdcclxuICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICAgY2xhc3NOYW1lPVwiaC02IHctNiB0ZXh0LXdoaXRlXCJcclxuICAgICAgICAgIGZpbGw9XCJub25lXCJcclxuICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxyXG4gICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcclxuICAgICAgICA+XHJcbiAgICAgICAgICA8cGF0aFxyXG4gICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxyXG4gICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcclxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg9ezJ9XHJcbiAgICAgICAgICAgIGQ9XCJNMTIgM3YxbTAgMTZ2MW05LTloLTFNNCAxMkgzbTE1LjM2NCA2LjM2NGwtLjcwNy0uNzA3TTYuMzQzIDYuMzQzbC0uNzA3LS43MDdtMTIuNzI4IDBsLS43MDcuNzA3TTYuMzQzIDE3LjY1N2wtLjcwNy43MDdNMTYgMTJhNCA0IDAgMTEtOCAwIDQgNCAwIDAxOCAwelwiXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvc3ZnPlxyXG4gICAgICApIDogKFxyXG4gICAgICAgIDxzdmdcclxuICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICAgY2xhc3NOYW1lPVwiaC02IHctNiB0ZXh0LWdyYXktNzAwXCJcclxuICAgICAgICAgIGZpbGw9XCJub25lXCJcclxuICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxyXG4gICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcclxuICAgICAgICA+XHJcbiAgICAgICAgICA8cGF0aFxyXG4gICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxyXG4gICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcclxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg9ezJ9XHJcbiAgICAgICAgICAgIGQ9XCJNMjAuMzU0IDE1LjM1NEE5IDkgMCAwMTguNjQ2IDMuNjQ2IDkuMDAzIDkuMDAzIDAgMDAxMiAyMWE5LjAwMyA5LjAwMyAwIDAwOC4zNTQtNS42NDZ6XCJcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9zdmc+XHJcbiAgICAgICl9XHJcbiAgICA8L2J1dHRvbj5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsIkRhcmtNb2RlVG9nZ2xlIiwiZGFya01vZGUiLCJzZXREYXJrTW9kZSIsInNhdmVkVGhlbWUiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRJdGVtIiwicmVtb3ZlIiwiYnV0dG9uIiwib25DbGljayIsImNsYXNzTmFtZSIsImFyaWEtbGFiZWwiLCJzdmciLCJ4bWxucyIsImZpbGwiLCJ2aWV3Qm94Iiwic3Ryb2tlIiwicGF0aCIsInN0cm9rZUxpbmVjYXAiLCJzdHJva2VMaW5lam9pbiIsInN0cm9rZVdpZHRoIiwiZCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/components/DarkModeToggle.jsx\n");

/***/ }),

/***/ "(pages-dir-node)/./src/pages/_app.js":
/*!***************************!*\
  !*** ./src/pages/_app.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/styles/globals.css */ \"(pages-dir-node)/./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_DarkModeToggle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/DarkModeToggle */ \"(pages-dir-node)/./src/components/DarkModeToggle.jsx\");\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_DarkModeToggle__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {}, void 0, false, {\n                fileName: \"D:\\\\MY WORK\\\\HDSE24.1\\\\Final_Project\\\\smart_menu\\\\src\\\\pages\\\\_app.js\",\n                lineNumber: 7,\n                columnNumber: 7\n            }, this),\n            \" \",\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"D:\\\\MY WORK\\\\HDSE24.1\\\\Final_Project\\\\smart_menu\\\\src\\\\pages\\\\_app.js\",\n                lineNumber: 8,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBOEI7QUFDMkI7QUFFMUMsU0FBU0MsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNsRCxxQkFDRTs7MEJBQ0UsOERBQUNILGtFQUFjQTs7Ozs7WUFBRzswQkFDbEIsOERBQUNFO2dCQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7O0FBRzlCIiwic291cmNlcyI6WyJEOlxcTVkgV09SS1xcSERTRTI0LjFcXEZpbmFsX1Byb2plY3RcXHNtYXJ0X21lbnVcXHNyY1xccGFnZXNcXF9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwiQC9zdHlsZXMvZ2xvYmFscy5jc3NcIjtcclxuaW1wb3J0IERhcmtNb2RlVG9nZ2xlIGZyb20gXCJAL2NvbXBvbmVudHMvRGFya01vZGVUb2dnbGVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcclxuICByZXR1cm4gKFxyXG4gICAgPD5cclxuICAgICAgPERhcmtNb2RlVG9nZ2xlIC8+IHsvKiDgtrjgt5ngtq3gtrEg4Lav4LeQ4La44LeU4LeA4LeP4La4IOC3hOC2u+C3kuC2uuC2pyDgt4Pgt5Lgtrrgtr3gt5Tgtrgg4La04LeS4Lan4LeUIOC3gOC2vSDgtrTgt5ngtrHgt4rgtrHgtrrgt5IgKi99XHJcbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuICAgIDwvPlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIkRhcmtNb2RlVG9nZ2xlIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/pages/_app.js\n");

/***/ }),

/***/ "(pages-dir-node)/./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(pages-dir-node)/./src/pages/_app.js"));
module.exports = __webpack_exports__;

})();