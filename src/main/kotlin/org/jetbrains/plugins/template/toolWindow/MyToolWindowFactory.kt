package org.jetbrains.plugins.template.toolWindow

import com.intellij.openapi.components.service
import com.intellij.openapi.project.Project
import com.intellij.openapi.wm.ToolWindow
import com.intellij.openapi.wm.ToolWindowFactory
import com.intellij.ui.components.JBLabel
import com.intellij.ui.components.JBPanel
import com.intellij.ui.content.ContentFactory
import org.jetbrains.plugins.template.MyBundle
import org.jetbrains.plugins.template.services.MyProjectService
import javax.swing.BorderFactory
import javax.swing.JButton
import javax.swing.JList
import javax.swing.JScrollPane


class MyToolWindowFactory : ToolWindowFactory {

    override fun createToolWindowContent(project: Project, toolWindow: ToolWindow) {
        val myToolWindow = MyToolWindow(toolWindow)
        val content = ContentFactory.getInstance().createContent(myToolWindow.getContent(), null, false)
        toolWindow.contentManager.addContent(content)
    }

    override fun shouldBeAvailable(project: Project) = true

    class MyToolWindow(toolWindow: ToolWindow) {

        private val service = toolWindow.project.service<MyProjectService>()

        fun getContent() = JBPanel<JBPanel<*>>(java.awt.BorderLayout()).apply {
            border = BorderFactory.createEmptyBorder(10, 10, 10, 10)

            // Header
            val headerLabel = JBLabel(MyBundle.message("testCaseManagerTitle", "TestCase Manager"))
            headerLabel.font = headerLabel.font.deriveFont(java.awt.Font.BOLD, 14f)
            add(headerLabel, java.awt.BorderLayout.NORTH)

            // Test cases list (placeholder)
            val testCaseList = JList(arrayOf("Test Case 1", "Test Case 2", "Test Case 3"))
            add(JScrollPane(testCaseList), java.awt.BorderLayout.CENTER)

            // Action panel
            val actionPanel = JBPanel<JBPanel<*>>().apply {
                add(JButton(MyBundle.message("loadTestCases")).apply {
                    addActionListener {
                        // TODO: Load test cases from YAML
                        service.getRandomNumber()
                    }
                })
                add(JButton(MyBundle.message("refresh")).apply {
                    addActionListener {
                        // TODO: Refresh test cases
                    }
                })
            }
            add(actionPanel, java.awt.BorderLayout.SOUTH)
        }
    }
}
