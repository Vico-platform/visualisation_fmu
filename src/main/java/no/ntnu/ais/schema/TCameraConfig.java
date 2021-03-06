
package no.ntnu.ais.schema;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for TCameraConfig complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="TCameraConfig">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="initialPosition" type="{http://github.com/Vico-platform/VisualisationFmu/VisualFmuConfig}TPosition"/>
 *       &lt;/sequence>
 *       &lt;attribute name="target" type="{http://www.w3.org/2001/XMLSchema}string" />
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "TCameraConfig", namespace = "http://github.com/Vico-platform/VisualisationFmu/VisualFmuConfig", propOrder = {
    "initialPosition"
})
public class TCameraConfig {

    @XmlElement(namespace = "http://github.com/Vico-platform/VisualisationFmu/VisualFmuConfig", required = true)
    protected TPosition initialPosition;
    @XmlAttribute(name = "target")
    protected String target;

    /**
     * Gets the value of the initialPosition property.
     * 
     * @return
     *     possible object is
     *     {@link TPosition }
     *     
     */
    public TPosition getInitialPosition() {
        return initialPosition;
    }

    /**
     * Sets the value of the initialPosition property.
     * 
     * @param value
     *     allowed object is
     *     {@link TPosition }
     *     
     */
    public void setInitialPosition(TPosition value) {
        this.initialPosition = value;
    }

    /**
     * Gets the value of the target property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTarget() {
        return target;
    }

    /**
     * Sets the value of the target property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTarget(String value) {
        this.target = value;
    }

}
