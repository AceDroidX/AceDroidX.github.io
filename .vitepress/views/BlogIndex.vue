<script setup lang="ts">
import { useRouter } from "vitepress";
import { nextTick } from "vue";
const router = useRouter();
const cards = [
  {
    title: "在Vue.js中手动显式指定子组件的泛型",
    description: "",
    time: "2025-02-23",
    link: "/notes/2025-02-23-specify-generics-child-vue",
  },
  {
    title: "华为笔记本充电控制逆向过程记录",
    description: "摆脱花里胡哨的华为电脑管家",
    time: "2023-06-03",
    link: "https://blog.acedroidx.top/HuaweiBatteryControl/",
  },
  {
    title: "【七海/MAD】🦈鲨反射🦈-借物表/相关技术",
    description: "",
    time: "2022-01-19",
    link: "/notes/2022-01-19-shark-reflection",
  },
  {
    title: "vtuber转播新方案-自建直播服务器",
    description: "",
    time: "2020-03-08",
    link: "/notes/2020-03-08-a-new-way-to-rebroadcast",
  },
];
async function onClick(link: string) {
  if (link.startsWith("http")) {
    await nextTick();
    window.open(link, "_blank");
  } else {
    router.go(link);
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 p-8 md:mx-auto md:w-[650px]">
    <h1 class="text-4xl font-bold">✨ 近期更新</h1>
    <div
      v-for="card in cards"
      @click="onClick(card.link)"
      class="group flex rounded-xl border border-gray-200 bg-gray-50 p-8 transition-all hover:border-green-500 hover:transition-all dark:border-gray-800 dark:bg-gray-800"
    >
      <div class="flex w-full flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold">{{ card.title }}</h2>
          <div>{{ card.time }}</div>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-gray-800 dark:text-gray-100">
            {{ card.description }}
          </p>
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="fill-gray-800 transition-all hover:transition-all group-hover:fill-green-500 dark:fill-gray-100"
            fill="currentColor"
          >
            <title>arrow-right</title>
            <path
              d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
