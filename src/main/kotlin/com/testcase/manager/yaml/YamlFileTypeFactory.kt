package com.testcase.manager.yaml

import com.intellij.openapi.fileTypes.FileTypeConsumer
import com.intellij.openapi.fileTypes.FileTypeFactory

/**
 * YAML 文件类型工厂
 * 用于注册 YAML 文件类型到 IntelliJ Platform
 */
class YamlFileTypeFactory : FileTypeFactory() {
    
    override fun createFileTypes(consumer: FileTypeConsumer) {
        consumer.consume(
            YamlFileType.INSTANCE,
            "yaml;yml"
        )
    }
}
