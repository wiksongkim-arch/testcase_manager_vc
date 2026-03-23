package com.testcase.manager.yaml

import com.intellij.openapi.fileTypes.FileType
import com.intellij.openapi.util.IconLoader
import com.intellij.openapi.vfs.VirtualFile
import javax.swing.Icon

/**
 * YAML 文件类型定义
 * 用于注册和识别测试用例 YAML 文件
 */
class YamlFileType private constructor() : FileType {
    
    companion object {
        @JvmStatic
        val INSTANCE = YamlFileType()
        
        const val DEFAULT_EXTENSION = "yaml"
        const val NAME = "TestCase YAML"
        const val DESCRIPTION = "TestCase Manager YAML file"
    }
    
    override fun getName(): String = NAME
    
    override fun getDescription(): String = DESCRIPTION
    
    override fun getDefaultExtension(): String = DEFAULT_EXTENSION
    
    override fun getIcon(): Icon? = IconLoader.getIcon("/icons/testcase-yaml.svg", YamlFileType::class.java)
    
    override fun isBinary(): Boolean = false
    
    override fun isReadOnly(): Boolean = false
    
    override fun getCharset(file: VirtualFile, content: ByteArray): String? = "UTF-8"
}
