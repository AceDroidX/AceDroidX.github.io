# 在Vue.js中手动显式指定子组件的泛型
## Manually Explicitly Specifying Generics for Child Components in Vue.js

泛型(Generic)是个好东西，在Vue结合作用域插槽(Scoped Slots)的时候，可以对组件做到类似面向对象编程里封装继承重写的作用。但是Vue的泛型组件在官方文档中只有[从Props自动推导的示例](https://cn.vuejs.org/api/sfc-script-setup#generics)，如果Props里没有泛型类型，那么就需要手动指定泛型，不然作用域插槽内的泛型无法推导。然而目前互联网上几乎没有手动指定泛型的教程（也有可能是我搜的有问题），在经过大量搜索后，我个人总结并整理出了这篇文章

TLDR：如果你已经了解泛型是什么/想看关键部分，请跳转到下面的[5. 总结](#_5-总结)

## 1. 从最简单的例子开始

例如下面的例子：

`model.ts`文件定义了Teacher和Student两个类型，分别继承自Person。我们需要将这两个类型的所有字段显示出来

::: code-group

```ts [model.ts]
export type Person = {
    name: string;
    age: number;
}
export type Teacher = Person & {
    course: string;
}
export type Student = Person & {
    class: string;
}
```

```vue [Teacher.vue]
<script setup lang="ts">
import { ref } from "vue";
import type { Teacher } from "./model";
const teacher = ref<Teacher>({
    name: "AceDroidX",
    age: 25,
    course: "Vue.js"
});
</script>
<template>
    <p>Name: {{ teacher.name }}</p>
    <p>Age: {{ teacher.age }}</p>
    <p>Course: {{ teacher.course }}</p>
</template>
```

```vue [Student.vue]
<script setup lang="ts">
import { ref } from "vue";
import type { Teacher } from "./model";
const student = ref<Student>({
    name: "Student 1",
    age: 20,
    class: "Class 1"
});
</script>
<template>
    <p>Name: {{ student.name }}</p>
    <p>Age: {{ student.age }}</p>
    <p>Class: {{ student.class }}</p>
</template>
```

:::

## 2. 使用插槽（普通的插槽，从props传入数据）

上面的例子可以看到，Teacher和Student都是Person的子类，他们都有name和age字段，页面也都要显示这两个字段，因此我们可以使用父子组件、Props和插槽来复用这段代码

::: code-group

```ts [model.ts]
export type Person = {
    name: string;
    age: number;
}
export type Teacher = Person & {
    course: string;
}
export type Student = Person & {
    class: string;
}
```

```vue [Person.vue]
<script setup lang="ts"> // [!code ++]
import { ref } from "vue"; // [!code ++]
import type { Person } from "./model"; // [!code ++]
const props = defineProps<{ person: Person }>(); // [!code ++]
</script> <!-- [!code ++] -->
<template> <!-- [!code ++] -->
    <p>Name: {{ props.person.name }}</p> <!-- [!code ++] -->
    <p>Age: {{ props.person.age }}</p> <!-- [!code ++] -->
    <slot></slot> <!-- [!code ++] -->
</template> <!-- [!code ++] -->
```

```vue [Teacher.vue]
<script setup lang="ts">
import { ref } from "vue";
import type { Teacher } from "./model";
import Person from "./Person.vue"; // [!code ++]
const teacher = ref<Teacher>({
    name: "AceDroidX",
    age: 25,
    course: "Vue.js"
});
</script>
<template>
    <p>Name: {{ student.name }}</p> <!-- [!code --] -->
    <p>Age: {{ student.age }}</p> <!-- [!code --] -->
    <p>Class: {{ student.class }}</p> <!-- [!code --] -->
    <Person :person="teacher"> <!-- [!code ++] -->
        <p>Course: {{ teacher.course }}</p> <!-- [!code ++] -->
    </Person> <!-- [!code ++] -->
</template>
```

```vue [Student.vue]
<script setup lang="ts">
import { ref } from "vue";
import type { Student } from "./model";
import Person from "./Person.vue"; // [!code ++]
const student = ref<Student>({
    name: "Student 1",
    age: 20,
    class: "Class 1"
});
</script>
<template>
    <p>Name: {{ student.name }}</p> <!-- [!code --] -->
    <p>Age: {{ student.age }}</p> <!-- [!code --] -->
    <p>Class: {{ student.class }}</p> <!-- [!code --] -->
    <Person :person="student"> <!-- [!code ++] -->
        <p>Class: {{ student.class }}</p> <!-- [!code ++] -->
    </Person> <!-- [!code ++] -->
</template>
```

:::

## 3. 使用泛型和作用域插槽（从外部获取数据，不显式指定组件的泛型）

上面的例子通过Props将值传入子组件，但是有时我们会让子组件自己从外部获取数据，例如使用fetch/axios从网络获取数据，同时又要使用插槽显示数据的一部分，此时就需要使用泛型和作用域插槽

然而在这种情况下，子组件的泛型是无法确定的，如果不显式指定泛型的话，子组件的泛型就是`Person.vue`中`generic="T extends Person"`里的`Person`类型，因此可以看到`类型“Person”上不存在属性“course/class”`的错误

::: code-group

```ts [model.ts]
export type Person = {
    name: string;
    age: number;
}
export type Teacher = Person & {
    course: string;
}
export type Student = Person & {
    class: string;
}
```

```vue [Person.vue]
<script setup lang="ts"> // [!code --]
import { ref } from "vue"; // [!code --]
<script setup lang="ts" generic="T extends Person"> // [!code ++]
import { onMounted, ref } from "vue"; // [!code ++]
import type { Person } from "./model";
const props = defineProps<{ person: Person }>(); // [!code --]
const props = defineProps<{ url: string }>(); // [!code ++]
const person = ref<T>(); // [!code ++]
async function getData() { // [!code ++]
    const resp = await fetch(props.url); // [!code ++]
    person.value = (await resp.json()) as T; // [!code ++]
} // [!code ++]
onMounted(getData); // [!code ++]
</script>
<template>
    <p>Name: {{ props.person.name }}</p> <!-- [!code --] -->
    <p>Age: {{ props.person.age }}</p> <!-- [!code --] -->
    <slot></slot> <!-- [!code --] -->
    <div v-if="person"> <!-- [!code ++] -->
        <p>Name: {{ person.name }}</p> <!-- [!code ++] -->
        <p>Age: {{ person.age }}</p> <!-- [!code ++] -->
        <slot :person="person"></slot> <!-- [!code ++] -->
    </div> <!-- [!code ++] -->
</template>
```

```json [Teacher.json]
{ // [!code ++]
    "name": "AceDroidX", // [!code ++]
    "age": 25, // [!code ++]
    "course": "Vue.js" // [!code ++]
} // [!code ++]
```

```vue [Teacher.vue]
<script setup lang="ts">
import { ref } from "vue"; // [!code --]
import type { Teacher } from "./model"; // [!code --]
import Person from "./Person.vue"; // [!code --]
const teacher = ref<Teacher>({ // [!code --]
    name: "AceDroidX", // [!code --]
    age: 25, // [!code --]
    course: "Vue.js" // [!code --]
}); // [!code --]
import Person from "./Person.vue"; // [!code ++]
</script>
<template>
    <Person :person="teacher"> <!-- [!code --] -->
        <p>Course: {{ teacher.course }}</p> <!-- [!code --] -->
    </Person> <!-- [!code --] -->
    <Person url="./Teacher.json" v-slot="{ person }"> <!-- [!code ++] -->
        <!-- 类型“Person”上不存在属性“course”。ts-plugin(2339) --> <!-- [!code ++] -->
        <p>Course: {{ person.course }}</p> <!-- [!code ++] -->
    </Person> <!-- [!code ++] -->
</template>
```

```json [Student.json]
{ // [!code ++]
    "name": "Student 1", // [!code ++]
    "age": 20, // [!code ++]
    "class": "Class 1" // [!code ++]
} // [!code ++]
```

```vue [Student.vue]
<script setup lang="ts">
import { ref } from "vue"; // [!code --]
import type { Student } from "./model"; // [!code --]
import Person from "./Person.vue"; // [!code --]
const student = ref<Student>({ // [!code --]
    name: "Student 1", // [!code --]
    age: 20, // [!code --]
    class: "Class 1" // [!code --]
}); // [!code --]
import Person from "./Person.vue"; // [!code ++]
</script>
<template>
    <Person :person="student"> <!-- [!code --] -->
        <p>Class: {{ student.class }}</p> <!-- [!code --] -->
    </Person> <!-- [!code --] -->
    <Person url="./Student.json" v-slot="{ person }"> <!-- [!code ++] -->
        <!-- 类型“Person”上不存在属性“class”。ts-plugin(2339) --> <!-- [!code ++] -->
        <p>Class: {{ person.class }}</p> <!-- [!code ++] -->
    </Person> <!-- [!code ++] -->
</template>
```

:::

## 4. 使用泛型和作用域插槽（从外部获取数据，显式指定组件的泛型）

### 4.1. 使用Warpper

接下来就要显式指定泛型实际是什么类型了，我们可以在script部分通过类型别名/类型包装(Warpper)来实现这一功能

::: code-group

```ts [model.ts]
export type Person = {
    name: string;
    age: number;
}
export type Teacher = Person & {
    course: string;
}
export type Student = Person & {
    class: string;
}
```

```vue [Person.vue]
<script setup lang="ts" generic="T extends Person">
import { onMounted, ref } from "vue";
import type { Person } from "./model";
const props = defineProps<{ url: string }>();
const person = ref<T>();
async function getData() {
  const resp = await fetch(props.url);
  person.value = (await resp.json()) as T;
}
onMounted(getData);
</script>
<template>
  <div v-if="person">
    <p>Name: {{ person.name }}</p>
    <p>Age: {{ person.age }}</p>
    <slot :person="person"></slot>
  </div>
</template>
```

```json [Teacher.json]
{
    "name": "AceDroidX",
    "age": 25,
    "course": "Vue.js"
}
```

```vue [Teacher.vue]
<script setup lang="ts">
import type { Teacher } from "./model"; // [!code ++]
import Person from "./Person.vue";
const PersonWarpper = Person<Teacher>; // [!code ++]
</script>
<template>
    <Person url="./Teacher.json" v-slot="{ person }"> <!-- [!code --] -->
    <PersonWarpper url="./Teacher.json" v-slot="{ person }"> <!-- [!code ++] -->
        <p>Course: {{ person.course }}</p>
    </Person> <!-- [!code --] -->
    </PersonWarpper> <!-- [!code ++] -->
</template>
```

```json [Student.json]
{
    "name": "Student 1",
    "age": 20,
    "class": "Class 1"
}
```

```vue [Student.vue]
<script setup lang="ts">
import type { Student } from "./model"; // [!code ++]
import Person from "./Person.vue";
const PersonWarpper = Person<Student>; // [!code ++]
</script>
<template>
    <Person url="./Student.json" v-slot="{ person }"> <!-- [!code --] -->
    <PersonWarpper url="./Student.json" v-slot="{ person }"> <!-- [!code ++] -->
        <p>Class: {{ person.class }}</p>
    </Person> <!-- [!code --] -->
    </PersonWarpper> <!-- [!code ++] -->
</template>
```

:::

### 4.2. 使用@vue-generic

当然更好的方法是通过@vue-generic注解来显式指定泛型

::: code-group

```ts [model.ts]
export type Person = {
    name: string;
    age: number;
}
export type Teacher = Person & {
    course: string;
}
export type Student = Person & {
    class: string;
}
```

```vue [Person.vue]
<script setup lang="ts" generic="T extends Person">
import { onMounted, ref } from "vue";
import type { Person } from "./model";
const props = defineProps<{ url: string }>();
const person = ref<T>();
async function getData() {
  const resp = await fetch(props.url);
  person.value = (await resp.json()) as T;
}
onMounted(getData);
</script>
<template>
  <div v-if="person">
    <p>Name: {{ person.name }}</p>
    <p>Age: {{ person.age }}</p>
    <slot :person="person"></slot>
  </div>
</template>
```

```json [Teacher.json]
{
    "name": "AceDroidX",
    "age": 25,
    "course": "Vue.js"
}
```

```vue [Teacher.vue]
<script setup lang="ts">
import type { Teacher } from "./model"; // [!code ++]
import Person from "./Person.vue";
</script>
<template>
    <!-- @vue-generic {Teacher} --> <!-- [!code ++] -->
    <Person url="./Teacher.json" v-slot="{ person }">
        <p>Course: {{ person.course }}</p>
    </Person>
</template>
```

```json [Student.json]
{
    "name": "Student 1",
    "age": 20,
    "class": "Class 1"
}
```

```vue [Student.vue]
<script setup lang="ts">
import type { Student } from "./model"; // [!code ++]
import Person from "./Person.vue";
</script>
<template>
    <!-- @vue-generic {Student} --> <!-- [!code ++] -->
    <Person url="./Student.json" v-slot="{ person }">
        <p>Class: {{ person.class }}</p>
    </Person>
</template>
```

:::

## 5. 总结

可以通过@vue-generic注解来显式指定泛型，使得子组件的泛型可以更加明确，从而避免无法确定的泛型的情况

```vue [Student.vue]
<script setup lang="ts">
import type { Student } from "./model"; // [!code ++]
import Person from "./Person.vue";
</script>
<template>
    <!-- @vue-generic {Student} --> <!-- [!code ++] -->
    <Person url="./Student.json" v-slot="{ person }">
        <p>Class: {{ person.class }}</p>
    </Person>
</template>
```

或者通过类型别名/类型包装(Warpper)来实现这一功能

```vue [Student.vue]
<script setup lang="ts">
import type { Student } from "./model"; // [!code ++]
import Person from "./Person.vue";
const PersonWarpper = Person<Student>; // [!code ++]
</script>
<template>
    <Person url="./Student.json" v-slot="{ person }"> <!-- [!code --] -->
    <PersonWarpper url="./Student.json" v-slot="{ person }"> <!-- [!code ++] -->
        <p>Class: {{ person.class }}</p>
    </Person> <!-- [!code --] -->
    </PersonWarpper> <!-- [!code ++] -->
</template>
```

## 6. 参考引用

[Support passing generic to child components `vuejs/core#8015`](https://github.com/vuejs/core/issues/8015)

[feat(compiler): support `v-generic` `vuejs/core#12301`](https://github.com/vuejs/core/pull/12301)

[feat(language-core): support `@vue-generic` `vuejs/language-tools#4971`](https://github.com/vuejs/language-tools/pull/4971)

[Generic component enhancements on `<script setup>`and on `defineComponent` `vuejs/rfcs#436`](https://github.com/vuejs/rfcs/discussions/436#discussioncomment-11758410)