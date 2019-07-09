<template>
  <tr>
    <td
      v-for="subItem in columns"
      v-bind:class="'align-' + subItem.align"
      :field="subItem.field"
      :width="subItem.width"
      :flex="subItem.flex"
      :key="subItem.key"
    >
      <span v-if="subItem.type === 'selection'">
        <space :depth="depth" />
        <span
          @click="toggle"
          v-if="data.children && data.children.length"
          class="zip-icon"
          v-bind:class="[open ? 'arrow-bottom' : 'arrow-right']"
        >
        </span>
        <span
          v-else
          class="zip-icon arrow-transparent"
        >
        </span>
        <span
          v-if="subItem.formatter"
          v-html="subItem.formatter(data)"
        ></span>
        <span
          v-else
          v-html="data[subItem.field]"
        ></span>
      </span>
      <span v-else>
        <span
          v-if="subItem.formatter"
          v-html="subItem.formatter(model)"
        ></span>
        <span v-else>{{data[subItem.field]}}</span>
      </span>
    </td>
  </tr>
  <template v-if="isFolder">
      <row
        v-show="open"
        v-for="childrenitem in data.children"
        :data="childrenitem"
        :columns="columns"
        :key="childrenitem.id"
        :depth="depth * 1 + 1"
        :custom_field="custom_field"
      >
      </row>
  </template>
</template>

<script>
import column from "./column.vue";
import space from "./space.vue";
export default {
  name: "row",
  props: ["data", "depth", "columns", "isdraggable", "custom_field"],
  data() {
    return {
      open: false,
      visibility: "visible",
    };
  },
  components: {
    column,
    space
  },
  computed: {
    isFolder() {
      return this.data.children && this.data.children.length > 0;
    }
  },
  methods: {
    toggle() {
      if (this.isFolder) {
        this.open = !this.open;
        // this.$forceUpdate();
      }
    }
  }
};
</script>

<style lang="scss">
.tree-block {
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
}
.tree-row {
  position: relative;
  display: flex;
  padding: 10px 10px;
  border-bottom: 1px solid #eee;
  line-height: 32px;
  &:hover {
    background: #ecf5ff;
  }
  .align-left {
    text-align: left;
  }
  .align-right {
    text-align: right;
  }
  .align-center {
    text-align: center;
  }
}
.hover-model {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
}
.hover-block {
  display: flex;
  opacity: 0.1;
  transition: opacity 0.5s;
  justify-content: center;
  align-items: center;
  i {
    color: #fff;
  }
}
.prev-block {
  height: 25%;
  background: #a0c8f7;
}
.center-block {
  height: 50%;
  background: #a0c8f7;
}
.next-block {
  height: 25%;
  background: #a0c8f7;
}
.action-item {
  color: #409eff;
  cursor: pointer;
  i {
    font-style: normal;
  }
}
.zip-icon {
  display: inline-block;
  width: 8px;
  height: 8px;
  vertical-align: middle;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAf0lEQVQ4T7XT0Q2AMAhF0dvNdALdSEdzBB3BDXQD85LGRNMCauS7nAKBxMdIhfwemIAtYpeAEeiANoLUgAGYI4gFqAMX8QAXiQBCNFDNRBVdIgpUkSfADjT3KqLACmg/XrWw5J+Li+VVYCZrMBbgJluA+tXA3Hv45ZgiR3i+OQBeSyYRPEyeUAAAAABJRU5ErkJggg==")
    no-repeat center;
  background-size: cover;
}
.arrow-transparent {
  visibility: hidden;
}
.arrow-right {
}
.arrow-bottom {
  transform: rotate(90deg);
}
[draggable="true"] {
  -khtml-user-drag: element;
}
</style>
    