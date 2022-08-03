export default function registerOr(lf) {
  lf.register('or', ({ DiamondNode, DiamondNodeModel, h }) => {
    // 自定义节点的view
    class EndView extends DiamondNode { }

    // 自定义节点的model
    class Model extends DiamondNodeModel {
      // 自定义节点形状属性
      initNodeData(data) {
        data.text = {
          value: 'OR',
          x: data.x,
          y: data.y,
          dragable: false,
          editable: true
        }
        super.initNodeData(data)
      }
      // 设置节点属性
      setAttributes() {
        // 自定义连线规则
        const sourceRules = {
          message: '',
          validate: (source, target, sourceAnchor, targetAnchor) => {
            if (source.id === target.id) {
              sourceRules.message = '相邻节点无法连接'
              return false
            } else if (sourceAnchor.type !== 'source') {
              sourceRules.message = '只允许从下边的锚点做为起始节点'
              return false
            } else {
              return true
            }
          }
        }
        const targetRules = {
          message: '',
          validate: (source, target, sourceAnchor, targetAnchor) => {
            if (source.id === target.id) {
              targetRules.message = '相邻节点无法连接'
              return false
            } else if (targetAnchor.type !== 'target') {
              targetRules.message = '只允许从上边的锚点做为结束节点'
              return false
            } else {
              return true
            }
          }
        }
        // 当节点作为连线的起始节点（source）时的校验规则
        this.targetRules.push(targetRules)
      }
      getDefaultAnchor() {
        const { width, height, x, y, id } = this
        console.log('width:' + width)
        console.log('height:' + height)
        return [
          {
            x: x - width / 2,
            y: y,
            type: 'target',
            edgeAddable: false, // 控制锚点是否可以从此锚点手动创建连线。默认为true。
            id: `${id}_0`
          },
          {
            x: x,
            y: y - height / 2,
            type: 'target',
            edgeAddable: false, // 控制锚点是否可以从此锚点手动创建连线。默认为true。
            id: `${id}_1`
          },
          {
            x: x + width / 2,
            y: y,
            type: 'target',
            edgeAddable: false, // 控制锚点是否可以从此锚点手动创建连线。默认为true。
            id: `${id}_3`
          },
          {
            x: x,
            y: y + height / 2,
            type: 'source',
            id: `${id}_4`
          }

        ]
      }
    }
    return {
      view: EndView,
      model: Model
    }
  })
}

