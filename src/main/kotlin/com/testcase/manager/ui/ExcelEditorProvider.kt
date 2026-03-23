package com.testcase.manager.ui

import com.intellij.openapi.fileEditor.FileEditor
import com.intellij.openapi.fileEditor.FileEditorPolicy
import com.intellij.openapi.fileEditor.FileEditorProvider
import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.VirtualFile
import com.testcase.manager.yaml.YamlFileType

/**
 * Excel 编辑器提供器
 * 为 YAML 测试用例文件提供 Excel 风格的编辑器
 */
class ExcelEditorProvider : FileEditorProvider {
    
    companion object {
        const val EDITOR_TYPE_ID = "testcase-excel-editor"
    }
    
    /**
     * 检查是否接受该文件
     * 只接受 YAML 文件类型的文件
     */
    override fun accept(project: Project, file: VirtualFile): Boolean {
        return file.fileType == YamlFileType.INSTANCE || 
               file.extension?.lowercase() in listOf("yaml", "yml")
    }
    
    /**
     * 创建 Excel 编辑器实例
     */
    override fun createEditor(project: Project, file: VirtualFile): FileEditor {
        return ExcelEditor(project, file)
    }
    
    /**
     * 获取编辑器类型 ID
     */
    override fun getEditorTypeId(): String = EDITOR_TYPE_ID
    
    /**
     * 编辑器策略
     * PLACE_BEFORE_DEFAULT_EDITOR 表示优先于默认编辑器显示
     */
    override fun getPolicy(): FileEditorPolicy = FileEditorPolicy.PLACE_BEFORE_DEFAULT_EDITOR
}
