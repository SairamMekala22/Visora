import React from 'react'

const AccessibilityFeatures = ({ preferences, setPreferences, isEditing }) => {
  const handleToggle = (field) => {
    setPreferences(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSliderChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: parseFloat(value) }))
  }

  const handleNestedChange = (parent, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: parseFloat(value)
      }
    }))
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">Accessibility Features</h3>
      
      {/* Boolean Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Voice Control */}
        <div className="flex items-center justify-between p-4 border-2 border-black rounded-lg">
          <label className="font-semibold">Voice Control</label>
          <input
            type="checkbox"
            checked={preferences.voiceControl || false}
            onChange={() => handleToggle('voiceControl')}
            disabled={!isEditing}
            className="w-6 h-6 cursor-pointer accent-black disabled:opacity-50"
          />
        </div>

        {/* Hide Images */}
        <div className="flex items-center justify-between p-4 border-2 border-black rounded-lg">
          <label className="font-semibold">Hide Images</label>
          <input
            type="checkbox"
            checked={preferences.hideImages || false}
            onChange={() => handleToggle('hideImages')}
            disabled={!isEditing}
            className="w-6 h-6 cursor-pointer accent-black disabled:opacity-50"
          />
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between p-4 border-2 border-black rounded-lg">
          <label className="font-semibold">High Contrast</label>
          <input
            type="checkbox"
            checked={preferences.highContrast || false}
            onChange={() => handleToggle('highContrast')}
            disabled={!isEditing}
            className="w-6 h-6 cursor-pointer accent-black disabled:opacity-50"
          />
        </div>

        {/* Dyslexia Font */}
        <div className="flex items-center justify-between p-4 border-2 border-black rounded-lg">
          <label className="font-semibold">Dyslexia-Friendly Font</label>
          <input
            type="checkbox"
            checked={preferences.dyslexiaFont || false}
            onChange={() => handleToggle('dyslexiaFont')}
            disabled={!isEditing}
            className="w-6 h-6 cursor-pointer accent-black disabled:opacity-50"
          />
        </div>

        {/* Highlight Links */}
        <div className="flex items-center justify-between p-4 border-2 border-black rounded-lg">
          <label className="font-semibold">Highlight Links</label>
          <input
            type="checkbox"
            checked={preferences.highlightLinks || false}
            onChange={() => handleToggle('highlightLinks')}
            disabled={!isEditing}
            className="w-6 h-6 cursor-pointer accent-black disabled:opacity-50"
          />
        </div>

        {/* Disable Animations */}
        <div className="flex items-center justify-between p-4 border-2 border-black rounded-lg">
          <label className="font-semibold">Disable Animations</label>
          <input
            type="checkbox"
            checked={preferences.disableAnimations || false}
            onChange={() => handleToggle('disableAnimations')}
            disabled={!isEditing}
            className="w-6 h-6 cursor-pointer accent-black disabled:opacity-50"
          />
        </div>

        {/* Focus Line */}
        <div className="flex items-center justify-between p-4 border-2 border-black rounded-lg">
          <label className="font-semibold">Focus Line</label>
          <input
            type="checkbox"
            checked={preferences.focusLine || false}
            onChange={() => handleToggle('focusLine')}
            disabled={!isEditing}
            className="w-6 h-6 cursor-pointer accent-black disabled:opacity-50"
          />
        </div>

        {/* Dimmer Overlay */}
        <div className="flex items-center justify-between p-4 border-2 border-black rounded-lg">
          <label className="font-semibold">Dimmer Overlay</label>
          <input
            type="checkbox"
            checked={preferences.dimmerOverlay || false}
            onChange={() => handleToggle('dimmerOverlay')}
            disabled={!isEditing}
            className="w-6 h-6 cursor-pointer accent-black disabled:opacity-50"
          />
        </div>

        {/* Block Popups */}
        <div className="flex items-center justify-between p-4 border-2 border-black rounded-lg">
          <label className="font-semibold">Block Popups</label>
          <input
            type="checkbox"
            checked={preferences.blockPopups || false}
            onChange={() => handleToggle('blockPopups')}
            disabled={!isEditing}
            className="w-6 h-6 cursor-pointer accent-black disabled:opacity-50"
          />
        </div>

        {/* Reading Mode */}
        <div className="flex items-center justify-between p-4 border-2 border-black rounded-lg">
          <label className="font-semibold">Reading Mode</label>
          <input
            type="checkbox"
            checked={preferences.readingMode || false}
            onChange={() => handleToggle('readingMode')}
            disabled={!isEditing}
            className="w-6 h-6 cursor-pointer accent-black disabled:opacity-50"
          />
        </div>

        {/* Disable Sticky Elements */}
        <div className="flex items-center justify-between p-4 border-2 border-black rounded-lg">
          <label className="font-semibold">Disable Sticky Elements</label>
          <input
            type="checkbox"
            checked={preferences.disableStickyElements || false}
            onChange={() => handleToggle('disableStickyElements')}
            disabled={!isEditing}
            className="w-6 h-6 cursor-pointer accent-black disabled:opacity-50"
          />
        </div>

        {/* Disable Hover Effects */}
        <div className="flex items-center justify-between p-4 border-2 border-black rounded-lg">
          <label className="font-semibold">Disable Hover Effects</label>
          <input
            type="checkbox"
            checked={preferences.disableHoverEffects || false}
            onChange={() => handleToggle('disableHoverEffects')}
            disabled={!isEditing}
            className="w-6 h-6 cursor-pointer accent-black disabled:opacity-50"
          />
        </div>
      </div>

      {/* Slider Features */}
      <div className="space-y-6 mt-8">
        {/* Letter Spacing */}
        <div className="p-4 border-2 border-black rounded-lg">
          <label className="font-semibold block mb-2">
            Letter Spacing: {(preferences.letterSpacing || 0).toFixed(2)}em
          </label>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.05"
            value={preferences.letterSpacing || 0}
            onChange={(e) => handleSliderChange('letterSpacing', e.target.value)}
            disabled={!isEditing}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>0em</span>
            <span>0.5em</span>
          </div>
        </div>

        {/* Cursor Size */}
        <div className="p-4 border-2 border-black rounded-lg">
          <label className="font-semibold block mb-2">
            Cursor Size: {preferences.cursorSize || 1}x
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="1"
            value={preferences.cursorSize || 1}
            onChange={(e) => handleSliderChange('cursorSize', e.target.value)}
            disabled={!isEditing}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Small</span>
            <span>Medium</span>
            <span>Large</span>
          </div>
        </div>

        {/* Font Size */}
        <div className="p-4 border-2 border-black rounded-lg">
          <label className="font-semibold block mb-2">
            Font Size: {preferences.fontSize || 100}%
          </label>
          <input
            type="range"
            min="100"
            max="200"
            step="10"
            value={preferences.fontSize || 100}
            onChange={(e) => handleSliderChange('fontSize', e.target.value)}
            disabled={!isEditing}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>100%</span>
            <span>200%</span>
          </div>
        </div>

        {/* Line Height */}
        <div className="p-4 border-2 border-black rounded-lg">
          <label className="font-semibold block mb-2">
            Line Height: {(preferences.lineHeight || 1.5).toFixed(1)}
          </label>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.1"
            value={preferences.lineHeight || 1.5}
            onChange={(e) => handleSliderChange('lineHeight', e.target.value)}
            disabled={!isEditing}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>1.0</span>
            <span>3.0</span>
          </div>
        </div>

        {/* Content Width */}
        <div className="p-4 border-2 border-black rounded-lg">
          <label className="font-semibold block mb-2">
            Content Width: {preferences.contentWidth || 1000}px
          </label>
          <input
            type="range"
            min="600"
            max="1400"
            step="50"
            value={preferences.contentWidth || 1000}
            onChange={(e) => handleSliderChange('contentWidth', e.target.value)}
            disabled={!isEditing}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>600px</span>
            <span>1400px</span>
          </div>
        </div>
      </div>

      {/* Text-to-Speech Settings */}
      <div className="mt-8 p-6 border-2 border-black rounded-lg bg-gray-50">
        <h4 className="text-lg font-bold mb-4">Text-to-Speech Settings</h4>
        <div className="space-y-4">
          {/* Rate */}
          <div>
            <label className="font-semibold block mb-2">
              Rate: {(preferences.textToSpeech?.rate || 1.0).toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.1"
              value={preferences.textToSpeech?.rate || 1.0}
              onChange={(e) => handleNestedChange('textToSpeech', 'rate', e.target.value)}
              disabled={!isEditing}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>0.1x</span>
              <span>10.0x</span>
            </div>
          </div>

          {/* Pitch */}
          <div>
            <label className="font-semibold block mb-2">
              Pitch: {(preferences.textToSpeech?.pitch || 1.0).toFixed(1)}
            </label>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.1"
              value={preferences.textToSpeech?.pitch || 1.0}
              onChange={(e) => handleNestedChange('textToSpeech', 'pitch', e.target.value)}
              disabled={!isEditing}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>0.0</span>
              <span>2.0</span>
            </div>
          </div>

          {/* Volume */}
          <div>
            <label className="font-semibold block mb-2">
              Volume: {((preferences.textToSpeech?.volume || 1.0) * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.1"
              value={preferences.textToSpeech?.volume || 1.0}
              onChange={(e) => handleNestedChange('textToSpeech', 'volume', e.target.value)}
              disabled={!isEditing}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Voice */}
          <div>
            <label className="font-semibold block mb-2">
              Voice: {preferences.textToSpeech?.voice || 0}
            </label>
            <input
              type="range"
              min="0"
              max="21"
              step="1"
              value={preferences.textToSpeech?.voice || 0}
              onChange={(e) => handleNestedChange('textToSpeech', 'voice', e.target.value)}
              disabled={!isEditing}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Voice 0</span>
              <span>Voice 21</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessibilityFeatures
