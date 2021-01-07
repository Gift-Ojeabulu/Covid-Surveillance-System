import React from 'react'
import { Card, CardContent, Typography} from '@material-ui/core'
import './InfoBox.css'

function InfoBox({ title, cases, total, active, color, ...props}) {
    let headingcolor
    if(title === 'Recovered'){
        headingcolor = 'green'
    } else {
        headingcolor = "red"
    }
    return (
        <Card className = {`infoBox ${active && 'infoBox--selected'} `} onClick = {props.onClick}>
            <CardContent>
                <Typography color = "textSecondary" className = "infoBox__title">
                    {title}
                </Typography>

                <h2 className = "infoBox__cases" style = {{color: headingcolor}}>{cases}</h2>

                <Typography color = "textSecondary" className = "infoBox__total">
                    {total} Total
                </Typography>

            </CardContent>
        </Card>
    )
}

export default InfoBox;