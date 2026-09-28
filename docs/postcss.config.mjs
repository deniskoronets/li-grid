import {postcssIsolateStyles} from "vitepress";

// Makes `.vp-raw` work: VitePress content styles (tables, lists, links) skip anything inside it,
// so the demo grid looks the way it would on a normal site.
export default {
    plugins: [postcssIsolateStyles({includeFiles: [/vp-doc\.css/]})],
};
