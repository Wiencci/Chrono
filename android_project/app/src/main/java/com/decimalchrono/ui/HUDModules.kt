package com.decimalchrono.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.decimalchrono.logic.DecimalTime
import com.decimalchrono.logic.DecimalDate
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun MainClockHUD(decimalTime: DecimalTime, decimalDate: DecimalDate, themeColor: Color) {
    Box(contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "DECIMAL CHRONO",
                color = themeColor.copy(alpha = 0.5f),
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 4.sp
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "%02d:%02d".format(decimalTime.hours, decimalTime.minutes),
                    color = Color.White,
                    fontSize = 54.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.ExtraBold
                )
                Text(
                    text = ":%02d".format(decimalTime.seconds),
                    color = Color.White.copy(alpha = 0.4f),
                    fontSize = 24.sp,
                    fontFamily = FontFamily.Monospace,
                    modifier = Modifier.padding(top = 16.dp)
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Text(
                text = "L%02d | S%02d | C%d/9".format(decimalDate.month, decimalDate.dayOfMonth, decimalDate.dayOfWeek),
                color = Color.White.copy(alpha = 0.6f),
                fontSize = 12.sp,
                fontFamily = FontFamily.Monospace,
                letterSpacing = 2.sp
            )
        }
    }
}

@Composable
fun LevelModule(pitch: Float, roll: Float, themeColor: Color) {
    // Standard to Decimal Degree Conversion (90° -> 100°D)
    val pitchD = (pitch / 90f) * 100f
    val rollD = (roll / 90f) * 100f
    val isLevel = Math.abs(pitch) < 2f && Math.abs(roll) < 2f

    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(24.dp)) {
        Box(modifier = Modifier.size(180.dp), contentAlignment = Alignment.Center) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val center = Offset(size.width / 2, size.height / 2)
                drawCircle(color = Color.White.copy(alpha = 0.1f), style = Stroke(width = 1f))
                drawLine(Color.White.copy(alpha = 0.1f), Offset(0f, center.y), Offset(size.width, center.y))
                drawLine(Color.White.copy(alpha = 0.1f), Offset(center.x, 0f), Offset(center.x, size.height))
                
                // Bubble
                drawCircle(
                    color = if (isLevel) themeColor else Color.Red,
                    radius = 20f,
                    center = Offset(
                        center.x + (roll * 4), 
                        center.y + (pitch * 4)
                    )
                )
            }
        }
        
        Spacer(modifier = Modifier.height(20.dp))
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
            MetricBlock("PITCH (X)", "%.1f°D".format(pitchD), themeColor)
            MetricBlock("ROLL (Y)", "%.1f°D".format(rollD), themeColor)
        }
    }
}

@Composable
fun AltimeterModule(altitude: Double, themeColor: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text("ALTITUDE (MSL)", color = themeColor.copy(alpha = 0.5f), fontSize = 10.sp, letterSpacing = 2.sp)
        Text(
            text = "${altitude.toInt()} AM",
            color = Color.White,
            fontSize = 58.sp,
            fontFamily = FontFamily.Monospace,
            fontWeight = FontWeight.Bold
        )
        Text("STABLE ATMOSPHERE", color = themeColor, fontSize = 8.sp, letterSpacing = 1.sp)
    }
}

@Composable
fun MetricBlock(label: String, value: String, themeColor: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(label, color = Color.White.copy(alpha = 0.4f), fontSize = 8.sp)
        Text(value, color = Color.White, fontSize = 14.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
    }
}
