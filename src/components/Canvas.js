import React,{useRef,useEffect} from 'react'

function Canvas({typeId,measurements}){
    const INCHES_TO_PIXELS = 300; // 96 pixels per inch for printing purposes
    const canvasWidthInInches = 8.5*4; // Target width in inches for the printed canvas
    const canvasHeightInInches = 11*4; // Target height in inches for the printed canvas

    function drawBackTop(ctx, multiplier){       
        const xLine3 = Number(measurements.L/2+0.5)
        const xLine1 = Number(xLine3-measurements.K/2-(3/8))
        const xLine2 = Number(xLine1 + Math.sqrt(Math.pow(measurements.J,2)-4))
        const xLine4 = Number(((xLine3-xLine1)/2)+xLine1)
    
        const yLine1 = Number(measurements.I/2 + 1.25)
        const yLine2 = Number((0.75*measurements.I)-(0.5*measurements.G)+0.625)
        
        ctx.beginPath()
          ctx.moveTo(0, yLine1*multiplier);  //armhole
          ctx.lineTo(xLine1*multiplier,yLine2*multiplier)
          ctx.lineTo(xLine1*multiplier,2*multiplier)
          ctx.lineTo(xLine2*multiplier,0) //shoulder 2
          ctx.lineTo(xLine3*multiplier,(measurements.I-measurements.G)*multiplier) //back center (curve)
          ctx.lineTo(xLine3*multiplier,measurements.I*multiplier) //waist center
          ctx.moveTo(xLine4*multiplier,yLine1*multiplier) //dart point
          ctx.lineTo((xLine4+0.75)*multiplier,measurements.I*multiplier) //right dart bottom
          ctx.moveTo(xLine4*multiplier,yLine1*multiplier) //dart point
          ctx.lineTo((xLine4-0.75)*multiplier,measurements.I*multiplier) //left dart bottom
          ctx.moveTo(xLine3*multiplier,measurements.I*multiplier) //waist center
          ctx.lineTo((xLine4-0.75)*multiplier,measurements.I*multiplier) //left dart bottom
          
          const a = Number((measurements.I/2)-1.25)
          const b = Number(xLine3-(measurements.B/4)-1.75)
    
          const x = Number((measurements.N*b/Math.sqrt(Math.pow(a,2)+Math.pow(b,2)))-b)
          const y = Number((measurements.N*a/Math.sqrt(Math.pow(a,2)+Math.pow(b,2)))-a)
          ctx.lineTo((b+x)*multiplier,(measurements.I+y)*multiplier) //bottom side
          ctx.lineTo(0, yLine1*multiplier); // back to underwarm
          ctx.stroke();
          //add curves
      }
    
    function drawFrontSkirt(ctx, multiplier){
        ctx.beginPath()
        ctx.moveTo(0,((measurements.B/4)+1)*multiplier)
        ctx.lineTo(7.125*multiplier,2*multiplier)
        ctx.lineTo(23.875*multiplier,0)
        ctx.lineTo(24.625*multiplier,(measurements.D/8 + 1.25)*multiplier)
        ctx.lineTo(24.625*multiplier,((measurements.D/4)+2.5)*multiplier)
        ctx.lineTo(0.625*multiplier,((measurements.D/4)+2.5)*multiplier)

        ctx.lineTo(0.625*multiplier, ((measurements.D/8)+2+(measurements.B/8))*multiplier)
        ctx.lineTo(4.625*multiplier,((measurements.D/8)+1.75+(measurements.B/8))*multiplier)
        ctx.lineTo(0.625*multiplier,((measurements.D/8)+1.5+(measurements.B/8))*multiplier)
        ctx.lineTo(0.625*multiplier, ((measurements.D/8)+2+(measurements.B/8))*multiplier)
        ctx.lineTo(0,((measurements.B/4)+1)*multiplier)
        ctx.stroke()
    }
   
    const canvasRef = useRef(null) // declare reference to canvas dom element and set its value to null
    let draw;

    if(typeId === "1"){
        draw = drawBackTop
    }
    else if(typeId === "3"){
        draw = drawFrontSkirt
    }
        
    function clearCanvas(canvas, context){
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    useEffect(() => {
        const canvas = canvasRef.current //return the current value of the canvas ref aka null
        const context = canvas.getContext('2d') //need to create 2d context object to draw in the canvas (getcontext returns an object with methods for drawing)

        // Set canvas dimensions based on the target print size in inches
        canvas.width = canvasWidthInInches * INCHES_TO_PIXELS;
        canvas.height = canvasHeightInInches * INCHES_TO_PIXELS;

        const scaleFactor = 0.25
        canvas.style.width = `${canvas.width * scaleFactor}px` // Scale down for screen display
        canvas.style.height = `${canvas.height * scaleFactor}px`

        // Scale the context so 1 unit in the drawing is 1 inch
        context.scale(INCHES_TO_PIXELS, INCHES_TO_PIXELS);
        context.lineWidth = 5/INCHES_TO_PIXELS 

        clearCanvas(canvas,context)
        draw(context, 1)
    }, [draw, measurements, typeId, canvasHeightInInches, canvasWidthInInches])


    // function exportPages(canvas, dpi = 300, pageWidthInInches = 8.5, pageHeightInInches = 11) {
    //     const pageWidth = pageWidthInInches * dpi;
    //     const pageHeight = pageHeightInInches * dpi;
    
    //     const pages = [];
    //     for (let y = 0; y < canvas.height; y += pageHeight) {
    //         for (let x = 0; x < canvas.width; x += pageWidth) {
    //             const pageCanvas = document.createElement("canvas");
    //             pageCanvas.width = pageWidth;
    //             pageCanvas.height = pageHeight;
    
    //             const pageCtx = pageCanvas.getContext("2d");
    //             pageCtx.drawImage(
    //                 canvas,
    //                 x, y, pageWidth, pageHeight, // Source rectangle
    //                 0, 0, pageWidth, pageHeight  // Destination rectangle
    //             );
    
    //             pages.push(pageCanvas.toDataURL("image/png"));
    //         }
    //     }
    //     return pages;
    // }

    // function printAllPages(canvasRef) {
    //     const canvas = canvasRef.current;
    //     if (!canvas) {
    //         console.error("Canvas not found");
    //         return;
    //     }
    
    //     const pages = exportPages(canvas); // Generate all page images
    
    //     // Create a single HTML document with all the pages
    //     const printWindow = window.open("", "_blank");
    //     if (!printWindow) {
    //         console.error("Failed to open a new window for printing");
    //         return;
    //     }
    
    //     printWindow.document.write(`
    //         <html>
    //             <head>
    //                 <title>Print All Pages</title>
    //                 <style>
    //                     body { margin: 0; padding: 0; }
    //                     .page {
    //                         width: 8.5in;
    //                         height: 11in;
    //                         page-break-after: always;
    //                         display: flex;
    //                         align-items: center;
    //                         justify-content: center;
    //                     }
    //                     img { width: 100%; height: auto; }
    //                 </style>
    //             </head>
    //             <body>
    //                 ${pages
    //                     .map(
    //                         (page, index) =>
    //                             `<div class="page"><img src="${page}" alt="Page ${index + 1}" /></div>`
    //                     )
    //                     .join("")}
    //             </body>
    //         </html>
    //     `);
    
    //     printWindow.document.close(); // Close the document to apply styles
    //     printWindow.focus(); // Focus on the new window
    //     printWindow.print(); // Trigger the print dialog
    // }

    // function printCanvas(canvasRef){
    //     const canvas = canvasRef.current
    //     if (!canvas) {
    //         console.error("Canvas element not found");
    //         return;
    //     }

    //     const dataUrl = canvas.toDataURL("image/png")
    //     const printWindow = window.open("","_blank")
    //     printWindow.document.write(`
    //         <html>
    //             <head>
    //                 <title>Print Canvas</title>
    //             </head>
    //             <body onload="window.print(); window.close();">
    //                 <img src="${dataUrl}" />
    //             </body>
    //         </html>
    //     `)
    //     printWindow.document.close();
    // }

    function printCanvas(canvasRef){
        const canvas = canvasRef.current
        if (!canvas) {
            console.error("Canvas element not found");
            return;
        }

        const dataUrl = canvas.toDataURL("image/png")
        const img = new Image()
        img.src = dataUrl

        const printWindow = window.open("","_blank")
        printWindow.document.write(`
                    <html>
                        <head>
                            <title>Print Canvas</title>
                        </head>
                        <body onload="window.print(); window.close();">
                            <img src="${dataUrl}" />
                        </body>
                    </html>
                `)
        printWindow.document.close();

        // img.onload = function(){
        //     const printWindow = window.open("","_blank")
        //     printWindow.document.write(`
        //                 <html>
        //                     <body>
        //                         <img src="${dataUrl}" />
        //                     </body>
        //                 </html>
        //             `)
        //     printWindow.document.close()
        // }
    }

    return (
        <div>
        <button className="print-button" onClick = {() => printCanvas(canvasRef)}>Print Canvas</button>
        <canvas ref={canvasRef}/>
        </div>
    )
}

export default Canvas;

