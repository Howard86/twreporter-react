import lottie from 'lottie-web'
import PropTypes from 'prop-types'
import React from 'react'

export default class Lottie extends React.Component {
  componentDidMount() {
    const {
      options: { loop, autoplay, animationData, rendererSettings, segments },
      eventListeners,
    } = this.props

    this.options = {
      container: this.el,
      renderer: 'svg',
      loop: loop !== false,
      autoplay: autoplay !== false,
      segments: segments !== false,
      animationData,
      rendererSettings,
    }
    this.anim = lottie.loadAnimation(this.options)
    this.registerEvents(eventListeners)
  }

  componentWillUnmount() {
    this.deRegisterEvents(this.props.eventListeners)
    this.destroy()
    this.options.animationData = null
    this.anim = null
  }

  setSpeed() {
    this.anim.setSpeed(this.props.speed)
  }

  setDirection() {
    this.anim.setDirection(this.props.direction)
  }

  play() {
    this.anim.play()
  }

  playSegments() {
    this.anim.playSegments(this.props.segments)
  }

  stop() {
    this.anim.stop()
  }

  pause() {
    if (this.props.isPaused && !this.anim.isPaused) {
      this.anim.pause()
    } else if (!this.props.isPaused && this.anim.isPaused) {
      this.anim.pause()
    }
  }

  destroy() {
    this.anim.destroy()
  }

  registerEvents(eventListeners) {
    eventListeners.forEach(eventListener => {
      this.anim.addEventListener(
        eventListener.eventName,
        eventListener.callback
      )
    })
  }

  deRegisterEvents(eventListeners) {
    eventListeners.forEach(eventListener => {
      this.anim.removeEventListener(
        eventListener.eventName,
        eventListener.callback
      )
    })
  }

  handleClickToPause = () => {
    // The pause() method is for handling pausing by passing a prop isPaused
    // This method is for handling the ability to pause by clicking on the animation
    if (this.anim.isPaused) {
      this.anim.play()
    } else {
      this.anim.pause()
    }
  }

  render() {
    const {
      width,
      height,
      ariaRole,
      ariaLabel,
      isClickToPauseDisabled,
      title,
    } = this.props

    const getSize = initial => {
      let size

      if (typeof initial === 'number') {
        size = `${initial}px`
      } else {
        size = initial || '100%'
      }

      return size
    }

    const lottieStyles = {
      width: getSize(width),
      height: getSize(height),
      overflow: 'hidden',
      margin: '0 auto',
    }

    const onClickHandler = isClickToPauseDisabled
      ? () => null
      : this.handleClickToPause

    return (
      // Bug with eslint rules https://github.com/airbnb/javascript/issues/1374
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        ref={c => {
          this.el = c
        }}
        style={lottieStyles}
        onClick={onClickHandler}
        title={title}
        role={ariaRole}
        aria-label={ariaLabel}
        tabIndex="0"
      />
    )
  }
}

Lottie.propTypes = {
  eventListeners: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isStopped: PropTypes.bool,
  isPaused: PropTypes.bool,
  speed: PropTypes.number,
  segments: PropTypes.arrayOf(PropTypes.number),
  direction: PropTypes.number,
  ariaRole: PropTypes.string,
  ariaLabel: PropTypes.string,
  isClickToPauseDisabled: PropTypes.bool,
  title: PropTypes.string,
}

Lottie.defaultProps = {
  eventListeners: [],
  isStopped: false,
  isPaused: false,
  speed: 1,
  ariaRole: 'button',
  ariaLabel: 'animation',
  isClickToPauseDisabled: false,
  title: '',
}
