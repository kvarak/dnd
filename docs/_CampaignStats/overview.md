---
title: Campaign Statistics
layout: campaign-stats
---

<div id="cache-alert" class="cache-status"></div>

<nav class="quick-nav">
  <strong>Quick Navigation:</strong>
  <a href="#summary">Summary</a> •
  <a href="#campaign-duration">Campaign Duration</a> •
  <a href="#class-levels-by-campaign">Class Levels</a> •
  <a href="#campaign-deaths-and-lethality">Deaths & Lethality</a> •
  <a href="#the-danger-zone">Danger Zone</a> •
  <a href="#class-survival-rate">Survival Rate</a> •
  <a href="#multiclass-combinations">Multiclass</a> •
  <a href="#class-popularity-evolution">Class Evolution</a> •
  <a href="#level-achievement-by-class">Level Achievement</a>
</nav>

# Campaign Statistics

<p class="campaign-overview">Overview of all campaigns run in the Varlyn world, tracking real-time and in-game progression across adventures.</p>

<p id="campaign-insights" class="campaign-overview">
  <!-- Auto-generated insights will be inserted here -->
</p>

## Summary

<div class="stats-grid" id="stats-summary">
  <div class="stat-card">
    <h5>Total Campaigns</h5>
    <div class="stat-value" id="total-campaigns">-</div>
  </div>
  <div class="stat-card">
    <h5>Total Characters</h5>
    <div class="stat-value" id="total-characters">-</div>
  </div>
  <div class="stat-card">
    <h5>Total Deaths</h5>
    <div class="stat-value" id="total-deaths">-</div>
  </div>
  <div class="stat-card">
    <h5>Total Levels Played</h5>
    <div class="stat-value" id="total-levels-played">-</div>
  </div>
</div>


## Campaign Duration

Comparison of real-world time spent versus in-game time elapsed for each campaign.

<div class="chart-container">
  <canvas id="campaignTimeline"></canvas>
</div>


## Class Levels by Campaign
Total levels lived by each class in each campaign. Y-axis shows total levels, bubble size indicates number of characters, color indicates the class.

<div class="chart-container">
  <canvas id="chartOption2"></canvas>
</div>

## Campaign Deaths and Lethality
Stacked bars show permanent and temporary deaths, while the purple line shows lethality index (deaths per 100 days of real-time play).

<div class="chart-container">
  <canvas id="chartOption1"></canvas>
</div>

## The Danger Zone
Killer CR vs Victim Level bubble chart. Bubble size = kill count. Colors show fight fairness: Dark Red = TPK territory, Red = Deadly threat, Orange = Fair, Green = Lucky shot, Blue = Upset. The diagonal line shows "fair fights" where CR matches level.

<div class="form-check form-switch d-flex align-items-center mb-3">
  <input class="form-check-input" type="checkbox" id="killer-detail-toggle"
         style="width: 3em; height: 1.5em; cursor: pointer;">
  <label class="form-check-label text-muted ms-2" for="killer-detail-toggle" style="cursor: pointer; margin-bottom: 0;">
    <small>Show grouped killers (general categories)</small>
  </label>
</div>

<div class="chart-container">
  <canvas id="chartOption11"></canvas>
</div>

## Class Survival Rate
Which classes are the safest (or deadliest) to play? Shows survival percentage for each class, regardless if it's a primary or secondary class.

<div class="chart-container" style="height: 600px;">
  <canvas id="chartArchetypeSurvival"></canvas>
</div>

## Multiclass Combinations
Which classes are "multiclass hubs"? Bubble chart shows each class's usage as primary (X-axis) vs secondary (Y-axis). Bubble size = number of unique partner classes.

<div class="chart-container">
  <canvas id="chartMulticlass"></canvas>
</div>

## Class Popularity Evolution
How class preferences have changed across campaigns over time.

<div class="chart-container">
  <canvas id="chartClassEvolution"></canvas>
</div>

## Level Achievement by Class
Distribution of levels lived (played) by each class. Shows actual progression experience, not just final level.

<div class="chart-container">
  <canvas id="chartLevelAchievement"></canvas>
</div>
