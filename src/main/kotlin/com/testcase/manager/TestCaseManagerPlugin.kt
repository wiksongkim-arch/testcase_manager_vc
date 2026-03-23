package com.testcase.manager

import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.project.Project
import com.intellij.openapi.startup.StartupActivity

/**
 * TestCase Manager 插件入口
 */
class TestCaseManagerPlugin : StartupActivity {
    
    companion object {
        const val PLUGIN_ID = "com.testcase.manager"
        const val PLUGIN_NAME = "TestCase Manager"
        
        private val LOG = Logger.getInstance(TestCaseManagerPlugin::class.java)
    }
    
    override fun runActivity(project: Project) {
        LOG.info("$PLUGIN_NAME 插件已启动")
    }
}
