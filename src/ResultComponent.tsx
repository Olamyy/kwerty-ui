import React from "react";
import {Metrics, ResultEntity} from "./types";
import _ from "lodash";
import CustomizedDialogs from "./InfoDialog";

type Props = {
    text: string;
    metrics: Metrics
}

export function ResultComponent({ text, metrics }: Props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const getSummary = (word: string) => {
        let summary = "";
        let color = ""
        valid.map((v: any) => {
            v.map((c: ResultEntity) => {
                if (c.openai_extract.value.toString() === word) {
                    summary = c.summary
                    color = '#ddFFdd'
                }
            })
        })

        if (summary === "") {
            notValid.map((v: any) => {
                v.map((c: ResultEntity) => {
                    if (c.openai_extract.value.toString() === word) {
                        summary = c.summary
                        color = '#FBCEB1'
                    }
                })
            })
        }

        return [color, summary]
    }

    function filterInvalidMetrics(metricData: Metrics): ResultEntity[][]  {
        return metricData.metrics.map((metric) => {
            return {
                ...metric,
                result: metric.result.filter((result) => !result.is_valid),
            }.result;

        })
        }
    function filterValidMetrics(metricData: Metrics): ResultEntity[][] {
        return metricData.metrics.map((metric) => {
            return {
                ...metric,
                result: metric.result.filter((result) => result.is_valid),
            }.result;
        })
    }

    const valid = filterValidMetrics(metrics);
    const notValid = filterInvalidMetrics(metrics);

    console.log({
        valid: valid,
        notValid: notValid
    })

    const flattened = _.flatten(_.concat(valid, notValid))
    const wordsToSearch = flattened.map((flat) => flat.openai_extract.value.toString())

    const blocks = text.split(" ")


    return (
        <>
            {
                blocks?.map((block) => {
                    const color_summary = getSummary(block)
                    return wordsToSearch?.includes(block) ? (<><mark style={{backgroundColor: color_summary[0]}} onClick={handleClickOpen}>{block}{' '}</mark>
                        <CustomizedDialogs open={open} handleClose={handleClose} content={color_summary[1]} /></>) : <>{block}{' '}</>
                })
            }
        </>
    );
}