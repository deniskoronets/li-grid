import DefaultTheme from "vitepress/theme";
import type {Theme} from "vitepress";
import UsersDemo from "../../components/UsersDemo.vue";

export default {
    extends: DefaultTheme,
    enhanceApp({app}) {
        app.component("UsersDemo", UsersDemo);
    },
} satisfies Theme;
