# Collapse/Expand Stage Columns Feature

## Overview
आपके pipeline view में अब **Collapse/Expand functionality** add हो गई है। यह feature आपको stage columns को collapse करने की सुविधा देता है।

## 🎯 **What's New:**

### **Collapse/Expand Button**
- हर stage column के header में एक **chevron button** add किया गया है
- **ChevronUp** (↑) - जब column expanded है
- **ChevronDown** (↓) - जब column collapsed है

### **How It Works:**
1. **Click करें** collapse button पर
2. **Stage content** hide हो जाएगा
3. **Only header** visible रहेगा (stage name + lead count + button)
4. **Click करें** expand button पर
5. **Full content** वापस show हो जाएगा

## 🎨 **Visual Design:**

### **Button Styling:**
- **Size**: 28px × 28px
- **Color**: Subtle gray with hover effects
- **Position**: Stage header के right side में
- **Hover Effect**: Background color change + scale animation

### **Smooth Transitions:**
- **Hover**: Background color change
- **Click**: Scale animation (0.95x)
- **State Change**: Smooth transition

## 🔧 **Technical Implementation:**

### **State Management:**
```javascript
const [isCollapsed, setIsCollapsed] = useState(false);
```

### **Conditional Rendering:**
```javascript
{!isCollapsed && (
    <div className={styles.leadList}>
        {/* Lead cards content */}
    </div>
)}
```

### **Button Component:**
```javascript
<button
    className={styles.collapseButton}
    onClick={() => setIsCollapsed(!isCollapsed)}
    title={isCollapsed ? "Expand stage" : "Collapse stage"}
>
    {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
</button>
```

## 📱 **Responsive Design:**
- **Desktop**: Full functionality
- **Tablet**: Optimized button size
- **Mobile**: Touch-friendly button

## 🎯 **Benefits:**

### **1. Better Space Management**
- Collapse unused stages
- Focus on important stages
- Cleaner interface

### **2. Improved Performance**
- Hidden content doesn't render
- Faster scrolling
- Better memory usage

### **3. Enhanced User Experience**
- Quick access to stage info
- Easy stage management
- Intuitive controls

## 🚀 **Usage Instructions:**

### **Collapse a Stage:**
1. Look for the **chevron up** (↑) button in stage header
2. **Click** the button
3. Stage content will **hide**
4. Button changes to **chevron down** (↓)

### **Expand a Stage:**
1. Look for the **chevron down** (↓) button in stage header
2. **Click** the button
3. Stage content will **show**
4. Button changes to **chevron up** (↑)

## 🎨 **Visual States:**

### **Expanded State:**
- ✅ Stage name visible
- ✅ Lead count visible
- ✅ All lead cards visible
- ✅ ChevronUp (↑) button

### **Collapsed State:**
- ✅ Stage name visible
- ✅ Lead count visible
- ❌ Lead cards hidden
- ✅ ChevronDown (↓) button

## 🔧 **CSS Classes:**

### **Main Button:**
```css
.collapseButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 150ms ease;
  color: hsl(var(--muted-foreground, 215 16% 47%));
  margin-left: 0.5rem;
}
```

### **Hover Effect:**
```css
.collapseButton:hover {
  background-color: hsl(var(--muted, 210 40% 96.1%));
  color: hsl(var(--foreground, 222.2 84% 4.9%));
  transform: scale(1.1);
}
```

### **Active Effect:**
```css
.collapseButton:active {
  transform: scale(0.95);
}
```

## 🎯 **Future Enhancements:**

### **Planned Features:**
1. **Bulk Collapse**: Collapse all stages at once
2. **Remember State**: Remember collapsed state per user
3. **Keyboard Shortcuts**: Ctrl+Click to collapse
4. **Animation**: Smooth slide up/down animation

### **Advanced Options:**
1. **Auto-collapse**: Auto-collapse stages with 0 leads
2. **Smart Collapse**: Collapse based on user activity
3. **Custom Settings**: User preferences for default state

## 📊 **Performance Impact:**

### **Positive Effects:**
- ✅ Reduced DOM elements when collapsed
- ✅ Faster rendering
- ✅ Better memory usage
- ✅ Improved scroll performance

### **No Negative Impact:**
- ❌ No data loss
- ❌ No functionality loss
- ❌ No performance degradation

## 🎉 **Conclusion:**

यह simple लेकिन powerful feature आपके pipeline view को और भी better बनाता है:

- **Space Management**: Better use of screen space
- **User Control**: Users can customize their view
- **Performance**: Improved rendering performance
- **UX**: Better user experience

अब आप अपने pipeline view में stages को collapse/expand कर सकते हैं और अपने workflow को optimize कर सकते हैं! 🚀
