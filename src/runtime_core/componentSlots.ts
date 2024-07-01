import { ShapeFlags } from "../shared/ShapeFlags"

export function initSlots(instance: any, children: any) {
    const { vnode } = instance
    if(vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
        normalizeObjectSlots(instance.slots, children)
    }
}

function normalizeObjectSlots(slots, children) {
    for(const key in children) {
        const value = children[key]
        // 处理具名插槽
        slots[key] = (props) => normalizeSlotValue(value(props))
    }
}

function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value]
}