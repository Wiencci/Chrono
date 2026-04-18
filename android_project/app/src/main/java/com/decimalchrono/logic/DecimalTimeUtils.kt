package com.decimalchrono.logic

import java.util.*
import kotlin.math.*

data class DecimalTime(
    val hours: Int,
    val minutes: Int,
    val seconds: Int,
    val totalDecimalSeconds: Double
)

data class DecimalDate(
    val year: Int,
    val month: Int,
    val dayOfMonth: Int,
    val dayOfWeek: Int,
    val dayOfYear: Int
)

object DecimalTimeUtils {

    fun getDecimalTime(date: Date = Date()): DecimalTime {
        val calendar = Calendar.getInstance()
        calendar.time = date
        
        val msSinceMidnight = calendar.get(Calendar.HOUR_OF_DAY) * 3600000L +
                calendar.get(Calendar.MINUTE) * 60000L +
                calendar.get(Calendar.SECOND) * 1000L +
                calendar.get(Calendar.MILLISECOND)
        
        val totalDecimalSeconds = msSinceMidnight / 864.0
        val hours = (totalDecimalSeconds / 10000).toInt()
        val minutes = ((totalDecimalSeconds % 10000) / 100).toInt()
        val seconds = (totalDecimalSeconds % 100).toInt()
        
        return DecimalTime(hours, minutes, seconds, totalDecimalSeconds)
    }

    fun getDecimalDate(date: Date = Date()): DecimalDate {
        val calendar = Calendar.getInstance()
        calendar.time = date
        
        val year = calendar.get(Calendar.YEAR)
        val dayOfYear = calendar.get(Calendar.DAY_OF_YEAR)
        val leap = isLeapYear(year)
        
        val monthLengths = intArrayOf(36, 37, 36, 37, 36, 37, 36, 37, 36, if (leap) 38 else 37)
        
        var currentDay = dayOfYear
        var month = 1
        for (i in 0 until 10) {
            if (currentDay <= monthLengths[i]) {
                month = i + 1
                break
            }
            currentDay -= monthLengths[i]
        }
        
        val dayOfMonth = currentDay
        val dayOfWeek = ((dayOfYear - 1) % 9) + 1
        
        return DecimalDate(year, month, dayOfMonth, dayOfWeek, dayOfYear)
    }

    private fun isLeapYear(year: Int): Boolean {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
    }

    fun toDecimalDegrees(standardDegrees: Double): Double {
        return (standardDegrees / 360.0) * 100.0
    }
}
