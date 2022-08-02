export default function registerDevice(lf) {
  lf.register('device', ({ RectNode, RectNodeModel, h }) => {
    // 自定义节点的view
    class View extends RectNode {
      getLabelShape() {
        const { model } = this.props
        const { x, y, width, height } = model
        const style = model.getNodeStyle()
        return h(
          'svg',
          {
            x: x - width / 2 + 5,
            y: y - height / 2 + 5,
            width: 25,
            height: 25,
            viewBox: '0 0 1274 1024'
          },
          h('path', {
            fill: style.stroke,
            d:
                'M864 64H160a96 96 0 0 0-96 96v576a96 96 0 0 0 96 96h320v64H256a32 32 0 0 0 0 64h512a32 32 0 0 0 0-64h-224v-64h320a96 96 0 0 0 96-96V160a96 96 0 0 0-96-96zM160 128h704a32 32 0 0 1 32 32v448H128V160a32 32 0 0 1 32-32z m736 608a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32v-64h768v64z'
          }
          )
        )
      }
      /**
     * 完全自定义节点外观方法
     */
      getShape() {
        // eslint-disable-next-line no-unused-vars
        const { model, graphModel } = this.props
        const { x, y, width, height, radius } = model
        const style = model.getNodeStyle()
        return h('g', {}, [
          h('rect', {
            ...style,
            x: x - width / 2,
            y: y - height / 2,
            rx: radius,
            ry: radius,
            width,
            height
          }),
          h('text',
            {
              fill: '#000000',
              fontSize: 12,
              x: x - 12,
              y: y + 4,
              width: 50,
              height: 25
            },
            '设备'),
          this.getLabelShape()
        ])
      }
    }

    // 自定义节点的model
    class Model extends RectNodeModel {
      // 自定义节点形状属性
      initNodeData(data) {
        data.text = {
          value: (data.text && data.text.value) || '',
          x: data.x,
          y: data.y + 55,
          dragable: false,
          editable: true
        }
        super.initNodeData(data)
      }
      // 设置节点属性
      setAttributes() {
        this.width = 120
        this.height = 60

        // 设置自定义锚点
        this.anchorsOffset = [
          [120 / 2, 0],
          [-120 / 2, 0]
        ]

        // 自定义连线规则
        const circleOnlyAsTarget = {
          message: '',
          validate: (source, target) => {
            const edgeData = lf.getGraphData().edges || []
            let curSourceId = null
            const targetIds = []
            for (let i = 0; i < edgeData.length; i++) {
              if (edgeData[i].targetNodeId === source.id) {
                curSourceId = edgeData[i].sourceNodeId
                break
              }
            }

            edgeData.forEach(item => {
              if (curSourceId && item.sourceNodeId === curSourceId) {
                targetIds.push(item.targetNodeId)
              }
            })

            if (curSourceId && curSourceId === target.id) {
              circleOnlyAsTarget.message = '无法连接'
              return false
            } else if (targetIds.includes(target.id)) {
              circleOnlyAsTarget.message = '相邻节点无法连接'
              return false
            } else {
              return true
            }
          }
        }

        // 当节点作为连线的起始节点（source）时的校验规则
        this.sourceRules.push(circleOnlyAsTarget)
      }
    }
    return {
      view: View,
      model: Model
    }
  })
}

