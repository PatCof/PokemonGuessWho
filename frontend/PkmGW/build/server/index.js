import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Outlet, Scripts, ServerRouter, UNSAFE_withComponentProps } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx, jsxs } from "react/jsx-runtime";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), 6e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region src/app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({ default: () => root_default });
var root_default = UNSAFE_withComponentProps(function App() {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", {}),
			/* @__PURE__ */ jsx("link", {
				rel: "icon",
				type: "image/svg+xml",
				href: "/greatball.svg"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			}),
			/* @__PURE__ */ jsx("title", { children: "Pokemon Guess Who" })
		] }), /* @__PURE__ */ jsxs("body", { children: [
			/* @__PURE__ */ jsx("div", { id: "root" }),
			/* @__PURE__ */ jsx(Outlet, {}),
			/* @__PURE__ */ jsx(Scripts, {}),
			/* @__PURE__ */ jsx("script", {
				type: "module",
				src: "/src/main.tsx"
			})
		] })]
	});
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-DqDxlDD-.js",
		"imports": ["/assets/rolldown-runtime-CbXtAM7H.js", "/assets/jsx-runtime-AYCG_qg1.js"],
		"css": []
	},
	"routes": { "root": {
		"id": "root",
		"parentId": void 0,
		"path": "",
		"index": void 0,
		"caseSensitive": void 0,
		"hasAction": false,
		"hasLoader": false,
		"hasClientAction": false,
		"hasClientLoader": false,
		"hasClientMiddleware": false,
		"hasDefaultExport": true,
		"hasErrorBoundary": false,
		"module": "/assets/root-BPu0kGsS.js",
		"imports": ["/assets/rolldown-runtime-CbXtAM7H.js", "/assets/jsx-runtime-AYCG_qg1.js"],
		"css": [],
		"clientActionModule": void 0,
		"clientLoaderModule": void 0,
		"clientMiddlewareModule": void 0,
		"hydrateFallbackModule": void 0
	} },
	"url": "/assets/manifest-ab60b2ff.js",
	"version": "ab60b2ff",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build\\client";
var basename = "/";
var future = {
	"unstable_customRouteDiscovery": false,
	"unstable_enableNodeReadableStream": false,
	"unstable_optimizeDeps": false
};
var ssr = true;
var unstable_apiOnly = false;
var unstable_apiServerOrigin = void 0;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = { "root": {
	id: "root",
	parentId: void 0,
	path: "",
	index: void 0,
	caseSensitive: void 0,
	module: root_exports
} };
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr, unstable_apiOnly, unstable_apiServerOrigin };
