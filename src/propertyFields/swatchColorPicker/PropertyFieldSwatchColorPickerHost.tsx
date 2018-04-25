import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { ColorPicker } from 'office-ui-fabric-react/lib/ColorPicker';
import { IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import {
	IPropertyFieldSwatchColorPickerHostProps,
	IPropertyFieldSwatchColorPickerHostState
} from './IPropertyFieldSwatchColorPickerHost';
import styles from './PropertyFieldSwatchColorPickerHost.module.scss';
import * as strings from 'PropertyControlStrings';
import { PropertyFieldSwatchColorPickerStyle, IPropertyFieldSwatchColorOption } from './IPropertyFieldSwatchColorPicker';
import * as appInsights from '../../common/appInsights';
import { SwatchColorPicker, IColorCellProps } from 'office-ui-fabric-react/lib/SwatchColorPicker';

export default class PropertyFieldSwatchColorPickerHost extends React.Component<IPropertyFieldSwatchColorPickerHostProps, IPropertyFieldSwatchColorPickerHostState> {

	constructor(props: IPropertyFieldSwatchColorPickerHostProps, state: IPropertyFieldSwatchColorPickerHostState) {
    super(props);

		appInsights.track('PropertyFieldSwatchColorPicker', {
		disabled: props.disabled
		});

		this.state = {
			errorMessage: undefined,
			inlinePickerShowing: false
		};

		this.onTogglePicker = this.onTogglePicker.bind(this);
	}

	public render(): JSX.Element {
		return (
			<div>
				{this.props.label && <Label>{this.props.label}</Label>}
				{this.props.style === PropertyFieldSwatchColorPickerStyle.Inline &&
					<table className={styles.cpInlineTable}>
						<tbody>
							<tr>
								<td style={{width:"100%"}}>
									{this.state.inlinePickerShowing &&
										<div className={'ms-slideDownIn20 ' + styles.cpSwatchRow}>
											{this.renderSwatchColorPicker()}
										</div>
									}
									{!this.state.inlinePickerShowing &&
										<div className="ms-slideUpIn20 ms-borderColor-neutralDark"
										 style={{backgroundColor:this.props.selectedColor, border:"1px solid"}}>&nbsp;</div>
									}
								</td>
								<td className={styles.cpInlineRow}>
									<IconButton
										title={strings.ColorPickerButtonTitle}
										disabled={this.props.disabled}
										iconProps={{ iconName: this.props.iconName, ariaLabel: strings.ColorPickerButtonTitle }}
										onClick={this.onTogglePicker} />
								</td>
							</tr>
						</tbody>
					</table>
				}
				{this.props.style === PropertyFieldSwatchColorPickerStyle.Full && this.renderSwatchColorPicker()
				}
			</div>
		);
	}

	private renderSwatchColorPicker(): JSX.Element {
		let colorCells: Array<IColorCellProps> = this.props.colors.map((value:IPropertyFieldSwatchColorOption, index:number) => {
			return {
				id: index.toString(),
				label: value.label,
				color: value.color
			};
		});

		return (
			<SwatchColorPicker
				disabled={this.props.disabled}
				columnCount={this.props.columnCount}
				selectedId={this.selectedColorId().toString()}
				colorCells={colorCells}
				cellShape={this.props.showAsCircles ? 'circle' : 'square'}
				onColorChanged={this.props.onColorChanged}
			/>
		);
	}

	private onTogglePicker(): void {
		this.setState({
			inlinePickerShowing: !this.state.inlinePickerShowing
		});
	}

	private selectedColorId(): number {
		for(let i = 0; i < this.props.colors.length; i++) {
			if(this.props.colors[i].color === this.props.selectedColor) {
				return i;
			}
		}
		return -1;
	}

}
