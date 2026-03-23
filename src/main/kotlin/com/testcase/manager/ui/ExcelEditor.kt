package com.testcase.manager.ui

import com.intellij.openapi.fileEditor.FileEditor
import com.intellij.openapi.fileEditor.FileEditorLocation
import com.intellij.openapi.fileEditor.FileEditorState
import com.intellij.openapi.fileEditor.FileEditorStateLevel
import com.intellij.openapi.project.Project
import com.intellij.openapi.util.Disposer
import com.intellij.openapi.util.Key
import com.intellij.openapi.vfs.VirtualFile
import com.intellij.ui.components.JBScrollPane
import com.intellij.ui.table.JBTable
import java.awt.BorderLayout
import java.awt.Dimension
import javax.swing.JComponent
import javax.swing.JPanel
import javax.swing.JTable
import javax.swing.table.DefaultTableModel

/**
 * Excel 风格编辑器
 * 为测试用例 YAML 文件提供表格编辑界面
 */
class ExcelEditor(
    private val project: Project,
    private val file: VirtualFile
) : FileEditor {
    
    private val component: JComponent
    private val table: JBTable
    private val tableModel: DefaultTableModel
    
    companion object {
        val EDITOR_NAME = Key.create<String>("TESTCASE_EXCEL_EDITOR")
    }
    
    init {
        // 创建表格模型
        tableModel = createTableModel()
        
        // 创建表格组件
        table = createTable()
        
        // 创建主界面
        component = createComponent()
        
        // 加载文件数据
        loadFileData()
    }
    
    /**
     * 创建表格模型
     */
    private fun createTableModel(): DefaultTableModel {
        val columns = arrayOf(
            "ID",
            "用例名称", 
            "优先级",
            "状态",
            "测试步骤",
            "预期结果"
        )
        
        return object : DefaultTableModel(columns, 0) {
            override fun isCellEditable(row: Int, column: Int): Boolean {
                return true // 所有单元格可编辑
            }
        }
    }
    
    /**
     * 创建表格组件
     */
    private fun createTable(): JBTable {
        return JBTable(tableModel).apply {
            // 设置表格属性
            autoResizeMode = JTable.AUTO_RESIZE_ALL_COLUMNS
            rowHeight = 30
            preferredScrollableViewportSize = Dimension(800, 600)
            
            // 设置表头
            tableHeader.apply {
                preferredSize = Dimension(preferredSize.width, 35)
                reorderingAllowed = true
                resizingAllowed = true
            }
            
            // 设置选择模式
            setSelectionMode(javax.swing.ListSelectionModel.MULTIPLE_INTERVAL_SELECTION)
            setCellSelectionEnabled(true)
            
            // 设置网格线
            showHorizontalLines = true
            showVerticalLines = true
            gridColor = java.awt.Color(200, 200, 200)
        }
    }
    
    /**
     * 创建主界面组件
     */
    private fun createComponent(): JComponent {
        return JPanel(BorderLayout()).apply {
            // 添加工具栏
            add(createToolBar(), BorderLayout.NORTH)
            
            // 添加表格（带滚动条）
            add(JBScrollPane(table), BorderLayout.CENTER)
            
            // 添加状态栏
            add(createStatusBar(), BorderLayout.SOUTH)
        }
    }
    
    /**
     * 创建工具栏
     */
    private fun createToolBar(): JComponent {
        return javax.swing.JToolBar().apply {
            isFloatable = false
            
            // 添加行按钮
            add(javax.swing.JButton("添加行").apply {
                addActionListener { addRow() }
            })
            
            add(javax.swing.JButton("删除行").apply {
                addActionListener { removeSelectedRow() }
            })
            
            add(javax.swing.JToolBar.Separator())
            
            // 保存按钮
            add(javax.swing.JButton("保存").apply {
                addActionListener { saveFile() }
            })
            
            add(javax.swing.JToolBar.Separator())
            
            // 刷新按钮
            add(javax.swing.JButton("刷新").apply {
                addActionListener { loadFileData() }
            })
        }
    }
    
    /**
     * 创建状态栏
     */
    private fun createStatusBar(): JComponent {
        return javax.swing.JLabel("就绪 - 共 0 行").apply {
            border = javax.swing.border.EmptyBorder(5, 10, 5, 10)
        }
    }
    
    /**
     * 添加新行
     */
    private fun addRow() {
        tableModel.addRow(arrayOf("", "", "P1", "草稿", "", ""))
        updateStatusBar()
    }
    
    /**
     * 删除选中行
     */
    private fun removeSelectedRow() {
        val selectedRow = table.selectedRow
        if (selectedRow >= 0) {
            tableModel.removeRow(selectedRow)
            updateStatusBar()
        }
    }
    
    /**
     * 更新状态栏
     */
    private fun updateStatusBar() {
        val statusBar = (component as JPanel).getComponent(2) as javax.swing.JLabel
        statusBar.text = "就绪 - 共 ${tableModel.rowCount} 行"
    }
    
    /**
     * 加载文件数据
     * 目前显示空白表格，后续实现 YAML 解析
     */
    private fun loadFileData() {
        // 清空现有数据
        tableModel.rowCount = 0
        
        // 添加示例数据（用于展示）
        tableModel.addRow(arrayOf("TC001", "登录成功", "P0", "已发布", "1. 打开登录页\n2. 输入用户名密码\n3. 点击登录", "登录成功，跳转首页"))
        tableModel.addRow(arrayOf("TC002", "登录失败-密码错误", "P1", "已发布", "1. 打开登录页\n2. 输入错误密码\n3. 点击登录", "提示密码错误"))
        
        updateStatusBar()
    }
    
    /**
     * 保存文件
     * 目前仅打印日志，后续实现 YAML 序列化
     */
    private fun saveFile() {
        // TODO: 实现 YAML 序列化
        javax.swing.JOptionPane.showMessageDialog(
            component,
            "保存功能将在后续实现",
            "提示",
            javax.swing.JOptionPane.INFORMATION_MESSAGE
        )
    }
    
    // ==================== FileEditor 接口实现 ====================
    
    override fun getComponent(): JComponent = component
    
    override fun getPreferredFocusedComponent(): JComponent = table
    
    override fun getName(): String = "Excel Editor"
    
    override fun setState(state: FileEditorState) {
        // 恢复编辑器状态
    }
    
    override fun isModified(): Boolean = false
    
    override fun isValid(): Boolean = file.isValid
    
    override fun addPropertyChangeListener(listener: java.beans.PropertyChangeListener) {
        // 添加属性变更监听器
    }
    
    override fun removePropertyChangeListener(listener: java.beans.PropertyChangeListener) {
        // 移除属性变更监听器
    }
    
    override fun getCurrentLocation(): FileEditorLocation? = null
    
    override fun dispose() {
        Disposer.dispose(this)
    }
    
    override fun <T : Any?> getUserData(key: Key<T>): T? = null
    
    override fun <T : Any?> putUserData(key: Key<T>, value: T?) {
        // 存储用户数据
    }
}
