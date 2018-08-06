import * as React from 'react';
import  SketchPicker from 'react-color'

interface ColorsPickerProps {
  onChange?: (value: string)=> void;
  initColor?: string;
  display?: string;
  allowPick?: boolean;
}

interface Color {
  r?: string,
  g?: string,
  b?: string,
  a?: string
}

interface ColorPickerState {
  displayColorPicker?: boolean,
  color?: Color,
  validCode?: boolean,
  hexCode?: string,
  popOverTop?: number
}

export class ColorsPicker extends React.Component<ColorsPickerProps,ColorPickerState> {
  state: ColorPickerState = {
    displayColorPicker: false,
    color: {
      r: '255',
      g: '255',
      b: '255',
      a: '1',
    },
    validCode: true
  };

  hexColorInput: HTMLInputElement;
  colorPicker: HTMLElement;

  /**
   * Handle click
   */
  handleClick() {
    let popOverTop = null;
    if (document.body.clientHeight - (this.calculateOffset(this.colorPicker).top - $('.app-content').scrollTop()) < 225) {
      popOverTop = -260;
    }
    if (this.props.allowPick || this.props.allowPick == null)
      this.setState({
        displayColorPicker: !this.state.displayColorPicker,
        popOverTop: popOverTop
      })
  };

  /**
   * Handle close picker
   */
  handleClose() {
    this.setState({
      displayColorPicker: false
    });
  };

  /**
   * handle change color
   * @param color
   */
  handleChange(color) {
    this.setState({color: color.rgb, hexCode: this.rgbaToHex(color.rgb)}, ()=> {
      if (this.props.onChange) {
        this.props.onChange(this.rgbaToHex(this.state.color));
      }
    });
  };

  /**
   * Convert hex to rgb
   */

  hexToRgba(hex): Color {
    let color: Color = {};
    if (hex && hex.length == 6) {
      hex += 'FF';
    }
    var result = /^#?([A-F\d]{2})([A-F\d]{2})([A-F\d]{2})([A-F\d]{2})$/i.exec(hex);
    if (result)
      color = {
        r: parseInt(result[1], 16).toString(),
        g: parseInt(result[2], 16).toString(),
        b: parseInt(result[3], 16).toString(),
        a: (parseInt(result[4], 16) / 255).toString()
      } as Color;
    return color;
  }

  componentToHex(c: number): string {
    let hexValid = /^[0-9]+$/;
    if (hexValid.test(c + "")) {
      var hex = c.toString(16);
      return hex.length == 1 ? ("0" + hex) : hex;
    }
    return "";
  }

  /**
   * rgba to hex
   */
  rgbaToHex(color: Color): string {
    if (color)
      return (""
      + this.componentToHex(+color.r)
      + this.componentToHex(+color.g)
      + this.componentToHex(+color.b)
      + this.componentToHex(Math.floor(+color.a * 255))).toUpperCase();
    return "";
  }


  /**
   * component did mount
   */
  componentDidMount() {
    this.setState({
        color: this.hexToRgba(this.props.initColor),
        hexCode: this.props.initColor ? this.props.initColor.toUpperCase() : ""
      },
      ()=> {
        this.validEnterHex();
      });
  }

  /**
   * next props received
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.initColor) {
      let color = this.hexToRgba(nextProps.initColor);
      this.setState({
        color: color,
        hexCode: this.rgbaToHex(color)
      });
    } else {
      this.setState({color: this.hexToRgba('FFFFFF'), hexCode: ""});
    }
  }

  /**
   *  valid and set new code for color picker
   * @returns {any}
   */
  validEnterHex(onChange?: ()=>void) {
    let hexValid = /^[a-fA-F0-9]+$/;
    if (hexValid.test(this.state.hexCode)) {
      if (this.state.hexCode.length > 8) {
        this.setState({hexCode: this.state.hexCode.substr(0, 8).toUpperCase()}, onChange)
      } else {
        let newHex = this.state.hexCode + Array(9 - this.state.hexCode.length).join("F");
        this.setState({hexCode: newHex.toUpperCase(), color: this.hexToRgba(newHex)}, onChange);
      }
    } else {
      this.setState({hexCode: this.rgbaToHex(this.state.color)}, onChange);
    }
  }

  calculateOffset(element) {
    var top = 0, left = 0;
    do {
      top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);

    return {
      top: top,
      left: left
    };
  };

  render() {
    const styles = {
        color: {
          border: '1px solid #EAE2E2',
          display: 'inline-block',
          marginRight: '5px',
          width: '30px',
          height: '1.2142em',
          background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
          verticalAlign: 'bottom'
        },
        swatch: {
          background: '#fff',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: (!this.props.allowPick && this.props.allowPick != null) ? "auto": "pointer",
          lineHeight: '1.2142em',
          padding: '.67861429em 1em',
          borderRadius: '.28571429rem',
          fontSize: '1em',
          width: '143px'
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
          display: this.state.displayColorPicker ? 'block' : 'none',
          top: this.state.popOverTop ? this.state.popOverTop : null
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
          //background: '#3D3A3A',
          //opacity: .5
        }
        ,
      }
      ;

    let colorPickerStyle = {
      display: this.props.display ? this.props.display : 'inline-block',
      background: '#ffffff',
      position: 'relative'
    };

    return (
      <div className="color-picker" style={colorPickerStyle} ref={(ele)=>{this.colorPicker= ele;}}>
        <div style={ styles.swatch }>
          <div style={ styles.color }
               onClick={()=> this.handleClick() }/>
          <div style={{width: '80px',display: 'inline-block'}}>
            <input
              style={{padding: '0px', border: 'none',maxWidth: "88%"}}
              type="text"
              readOnly={!this.props.allowPick && this.props.allowPick != null ? 'readOnly': ''}
              onChange={(e)=>{
                this.state.hexCode =  e.target['value'];
               }}
              onBlur={()=>{
                 this.validEnterHex(()=>{
                   if (this.props.onChange) {
                    this.props.onChange(this.rgbaToHex(this.state.color));
                  }
                 });}}
              ref={ (input) => {input? input.value= this.state.hexCode: ""; this.hexColorInput = input;}}/>
            {
              (!this.props.allowPick && this.props.allowPick != null) ? null :
                <span onClick={()=>{
                      this.setState({color: {
                                    r: '255',
                                    g: '255',
                                    b: '255',
                                    a: '1',
                                  }},
                                  ()=>{
                                  if (this.props.onChange) {
                                      this.props.onChange("");
                                    }
                                    this.setState({ hexCode: ""});
                                  }
                               );
                           }}

                      title="Clear"
                      style={{cursor:"pointer", color:"#db2828", position: "absolute", right:"8px", display: this.state.hexCode?"":"none"}}>X</span>}
          </div>
        </div>
        {
          this.state.displayColorPicker ?
            <div style={ styles.popover }>
              <div style={ styles.cover }
                   onClick={()=>  this.handleClose() }/>
              <SketchPicker color={ this.state.color }
                            onChange={(color)=>  {this.handleChange(color);}}/>
            </div> : null
        }
      </div>
    )
  }

}

