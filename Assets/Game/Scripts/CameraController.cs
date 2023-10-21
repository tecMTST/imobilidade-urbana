using UnityEngine;
using Cinemachine;

public class CameraController : MonoBehaviour
{
    public Camera[] roomCameras;

    private void Start()
    {
        // Disable all cameras except the first room's camera
        for (int i = 1; i < roomCameras.Length; i++)
        {
            roomCameras[i].gameObject.SetActive(false);
        }
    }

    public void SwitchRoom(int roomIndex)
    {
        for (int i = 0; i < roomCameras.Length; i++)
        {
            roomCameras[i].gameObject.SetActive(i == roomIndex);
        }
    }
}
