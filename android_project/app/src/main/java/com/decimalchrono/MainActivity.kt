package com.decimalchrono

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import com.decimalchrono.logic.DecimalTimeUtils
import com.decimalchrono.ui.*
import kotlinx.coroutines.delay
import java.util.*

enum class AppMode { CLOCK, LEVEL, ALTIMETER, ZEN }

class MainActivity : ComponentActivity() {
    private lateinit var sensorHandler: SensorHandler

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        sensorHandler = SensorHandler(this)
        
        setContent {
            val themeColor = Color(0xFFCCFF00)
            var currentMode by remember { mutableStateOf(AppMode.CLOCK) }
            var currentTime by remember { mutableStateOf(Date()) }

            LaunchedEffect(Unit) {
                sensorHandler.start()
                while (true) {
                    currentTime = Date()
                    delay(16)
                }
            }

            Surface(modifier = Modifier.fillMaxSize(), color = Color.Black) {
                Box(contentAlignment = Alignment.Center) {
                    
                    // Background Rings (Always present)
                    HUDBackgroundRings(themeColor)

                    // Module Switcher
                    when (currentMode) {
                        AppMode.CLOCK -> MainClockHUD(
                            DecimalTimeUtils.getDecimalTime(currentTime),
                            DecimalTimeUtils.getDecimalDate(currentTime),
                            themeColor
                        )
                        AppMode.LEVEL -> LevelModule(sensorHandler.pitch.value, sensorHandler.roll.value, themeColor)
                        AppMode.ALTIMETER -> AltimeterModule(1240.0, themeColor) // Simulating for now
                        AppMode.ZEN -> Text("ZEN MODE ACTIVE", color = themeColor)
                    }

                    // Interaction Center
                    Box(
                        modifier = Modifier
                            .size(80.dp)
                            .clip(CircleShape)
                            .clickable {
                                currentMode = AppMode.values()[(currentMode.ordinal + 1) % AppMode.values().size]
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        // Invisible hit area for mode switching
                    }
                }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        sensorHandler.stop()
    }
}

@Composable
fun HUDBackgroundRings(themeColor: Color) {
    Canvas(modifier = Modifier.size(360.dp)) {
        val center = Offset(size.width / 2, size.height / 2)
        
        // Decimal Ticks (100 divisions)
        for (i in 0 until 100) {
            val angle = (i / 100f) * 360f - 90f
            val isMajor = i % 10 == 0
            val length = if (isMajor) 20f else 10f
            val rad = Math.toRadians(angle.toDouble())
            
            val start = Offset(
                center.x + (size.width / 2 - 10) * cos(rad).toFloat(),
                center.y + (size.width / 2 - 10) * sin(rad).toFloat()
            )
            val end = Offset(
                center.x + (size.width / 2 - 10 - length) * cos(rad).toFloat(),
                center.y + (size.width / 2 - 10 - length) * sin(rad).toFloat()
            )
            
            drawLine(
                color = if (isMajor) themeColor else Color.Gray.copy(alpha = 0.3f),
                start = start,
                end = end,
                strokeWidth = if (isMajor) 3f else 1f
            )
        }
    }
}
