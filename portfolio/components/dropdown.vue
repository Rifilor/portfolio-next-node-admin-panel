<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <details  class="dropdown">
        <summary ref="drop" class="dropdown__panel">{{ getNameValue }} <span class="placeholder" v-if="!model">{{ $t('select') }}</span></summary>
        <ul class="dropdown__content">
            <li v-for="(item, i) in getList" :key="i" class="dropdown__option" :class="{'dropdown__option--active': model == props.list[i]}" v-on:click="select(props.list[i])">{{ item[props.watchValue] }} {{ props.localizationAdditionalyValue ? $t(item[props.localizationAdditionalyValue]) : '' }}</li>
        </ul>
    </details>
</template>
<script setup lang="ts">
//imports
import {useI18n} from "vue-i18n";
const i18n = useI18n();

//props
const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: any[],
  useLocalization?: boolean,
  nameDrop?: string,
  watchValue: string,
  idValue: string,
  localizationAdditionalyValue?: string,
}>()

//emit
const emit = defineEmits(['change'])

//values
const model = defineModel()
const drop = ref();

//methods
const select = (name: string): void => {
  drop.value.click()
  
  model.value = name != model.value ? name : ''
  emit('change')
  if(props.nameDrop) {
    localStorage.setItem(props.nameDrop, JSON.stringify(name != model.value ? name : ''))
  }
}

//computed
const getNameValue = computed((): string => {
  
  if(!model.value) {
    return ''
  }
    let text =  props.useLocalization == true ? ''+i18n.t(''+model.value[props.watchValue]) : ''+model.value[props.watchValue]
    if(props.localizationAdditionalyValue) {
      text+=` ${i18n.t(model.value[props.localizationAdditionalyValue])}`
    }
    return text
})
const getList = computed((): string[] => {

    if(props.useLocalization == true) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listCopy: any[] = JSON.parse(JSON.stringify(props.list))
      return listCopy.map(el=> { 
        el[props.watchValue] = i18n.t(el[props.watchValue])
        return el
      })
    } else {
      return props.list
    }  
     
})


//hook
onMounted(() : void => {
  if(props.nameDrop && localStorage.getItem(props.nameDrop))
  model.value = JSON.parse(''+localStorage.getItem(props.nameDrop))
  
})

</script>
<style lang="scss" scoped>
.dropdown {       
    position: relative;
    &__content {
        position: absolute;
        top: 32px;
        border: 1px solid #CFD8DC;
        border-radius: 4px;
        background-color: #fff;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }
    &__option {
        text-transform: capitalize;
        width: 100%;
        padding: 7px 10px;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
            background-color: #f7f7f7;
        }

        &--active {
          background-color: #ebe8e8;
        }
    }
    &__panel {
        text-transform: capitalize;
        position: relative;
        font-size: 14px;

        border-radius: 5px;
        border: 1px solid #d2d0d0;
        outline: none;
        transition: .2s linear;
        background-color: #F0F3F5;
        padding: 5px 15px;
        height: 30px;
        width: 100%;
        box-sizing: border-box;
        background-color: #fff;
    }
    .placeholder {
      font-size: 14px;
      font-weight: 500;
      color: #546E7A;
    }
        
}

summary {
  list-style: none;
  display: flex;
  align-items: center;
  padding: 10px;
}
summary::after {
  position: relative;
  right: -8px;
  content: '';
  width: 24px;
  height: 24px;
  background: url('https://www.svgrepo.com/show/335062/dropdown.svg') no-repeat;
  background-size: 24px 24px;
  margin-left: auto;
}

details[open] > summary::after {
  transform: rotate(180deg);
}

summary::-webkit-details-marker {
  display: none;
}

details[open] {
  z-index: 10;
}
</style>